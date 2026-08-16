/**
 * Proxy Service — forwards BFF-approved requests to the Java microservice.
 *
 * Authorization header is passed through so Java can validate independently.
 * conversationId is merged into the body so Java's SessionMemoryStore keys
 * history to the correct chat thread across stateless requests.
 */

const http = require("http");
const { URL } = require("url");

function resolveJavaTarget() {
    if (process.env.JAVA_SERVICE_URL) {
        try {
            const u = new URL(process.env.JAVA_SERVICE_URL);
            return {
                host: u.hostname,
                port: parseInt(u.port || (u.protocol === "https:" ? "443" : "80"), 10),
            };
        } catch (err) {
            console.warn("[proxy] Invalid JAVA_SERVICE_URL, falling back to host/port:", err.message);
        }
    }
    return {
        host: process.env.JAVA_SERVICE_HOST || "localhost",
        port: parseInt(process.env.JAVA_SERVICE_PORT || "8080", 10),
    };
}

const JAVA = resolveJavaTarget();

/**
 * Proxy a JSON req → Java at `path`, pipe the response back to `res`.
 */
function proxyToJava(req, res, path) {
    const body = req.body || {};
    const conversationId =
        body.conversationId ||
        req.query.conversationId ||
        (req.user ? `${req.user.id}::${req.user.policyId || "unknown"}` : null);

    const forwardBody = JSON.stringify(
        conversationId ? { ...body, conversationId } : body
    );

    const options = {
        hostname: JAVA.host,
        port: JAVA.port,
        path,
        method: req.method,
        headers: {
            "Content-Type": "application/json",
            "Content-Length": Buffer.byteLength(forwardBody),
            Authorization: req.headers["authorization"] || "",
        },
    };

    const proxyReq = http.request(options, (proxyRes) => {
        res.status(proxyRes.statusCode);
        // Ensure JSON responses are readable by the browser CORS stack
        const contentType = proxyRes.headers["content-type"];
        if (contentType) res.setHeader("Content-Type", contentType);
        proxyRes.pipe(res, { end: true });
    });

    proxyReq.on("error", (err) => {
        console.error(`[proxy] Java microservice unreachable (${JAVA.host}:${JAVA.port}): ${err.message}`);
        res.status(502).json({ message: "Upstream service unavailable", detail: err.message });
    });

    proxyReq.write(forwardBody);
    proxyReq.end();
}

/**
 * Proxy a multipart upload → Java at `path`.
 * Reconstructs a multipart body from multer's parsed file + fields,
 * then calls `onResponse(parsedJson)` with Java's JSON reply instead of
 * piping — so the caller can persist results to Postgres before responding.
 *
 * @param {import('express').Request}  req
 * @param {import('express').Response} res
 * @param {string}  path       Java endpoint path
 * @param {Function} onResponse callback(javaResponseJson)
 */
function proxyMultipartToJava(req, res, path, onResponse) {
    // Re-encode as multipart/form-data for Java
    const boundary = "----BFFBoundary" + Date.now();
    const chunks = [];

    // Append text fields
    const fields = req.body || {};
    for (const [key, value] of Object.entries(fields)) {
        chunks.push(
            Buffer.from(
                `--${boundary}\r\nContent-Disposition: form-data; name="${key}"\r\n\r\n${value}\r\n`
            )
        );
    }

    // Append the file part only if present
    if (req.file) {
        chunks.push(
            Buffer.from(
                `--${boundary}\r\nContent-Disposition: form-data; name="document"; filename="${req.file.originalname}"\r\nContent-Type: ${req.file.mimetype}\r\n\r\n`
            )
        );
        chunks.push(req.file.buffer);
        chunks.push(Buffer.from(`\r\n`));
    }

    chunks.push(Buffer.from(`--${boundary}--\r\n`));

    const body = Buffer.concat(chunks);
    const options = {
        hostname: JAVA.host,
        port: JAVA.port,
        path,
        method: "POST",
        headers: {
            "Content-Type": `multipart/form-data; boundary=${boundary}`,
            "Content-Length": body.length,
            Authorization: req.headers["authorization"] || "",
        },
    };

    const proxyReq = http.request(options, (proxyRes) => {
        let raw = "";
        proxyRes.on("data", (chunk) => { raw += chunk; });
        proxyRes.on("end", () => {
            try {
                onResponse(JSON.parse(raw));
            } catch {
                res.status(502).json({ message: "Invalid response from document validator.", raw });
            }
        });
    });

    proxyReq.on("error", (err) => {
        console.error(`[proxy-multipart] Java unreachable (${JAVA.host}:${JAVA.port}): ${err.message}`);
        res.status(502).json({ message: "Upstream service unavailable", detail: err.message });
    });

    proxyReq.write(body);
    proxyReq.end();
}

module.exports = { proxyToJava, proxyMultipartToJava };
