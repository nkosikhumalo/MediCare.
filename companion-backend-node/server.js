const express = require("express");
const cors = require("cors");
require("dotenv").config();
const csrfProtection = require("./middleware/csrf");

const db = require("./database/db");

const authRoutes = require("./routes/authRoutes");
const chatRoutes = require("./routes/chatRoutes");
const whatIfRoutes = require("./routes/whatIfRoutes");
const selfServiceRoutes = require("./routes/selfServiceRoutes");
const ragRoutes = require("./routes/ragRoutes");
const claimsRoutes = require("./routes/claimsRoutes");

const app = express();

const allowedOrigins = require("./middleware/csrf").allowedOrigins;
const jwtSecret = process.env.JWT_SECRET || process.env.MOCK_JWT_SIGNING_SECRET;
if (!jwtSecret || Buffer.byteLength(jwtSecret) < 32) {
  throw new Error("Set JWT_SECRET or MOCK_JWT_SIGNING_SECRET to a random secret of at least 32 bytes.");
}
if (process.env.NODE_ENV === "production" && !process.env.FRONTEND_ORIGINS) {
  throw new Error("Set FRONTEND_ORIGINS to the exact production frontend origin(s).");
}

app.disable("x-powered-by");
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  if (process.env.NODE_ENV === "production") {
    res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  }
  next();
});
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.has(origin)) return callback(null, true);
    return callback(null, false);
  },
  credentials: true,
}));
app.use(express.json({ limit: "1mb" }));
app.use((req, _res, next) => {
  req.cookies = {};
  for (const item of (req.headers.cookie || "").split(";")) {
    const separator = item.indexOf("=");
    if (separator < 0) continue;
    const name = item.slice(0, separator).trim();
    try { req.cookies[name] = decodeURIComponent(item.slice(separator + 1).trim()); } catch { /* ignore malformed cookie */ }
  }
  next();
});
app.use(csrfProtection);

// Public — no auth required.
app.use("/api/auth", authRoutes);

// Protected — JWT + role enforcement applied inside each router.
app.use("/api/chat", chatRoutes);
app.use("/api/what-if", whatIfRoutes);
app.use("/api/self-service", selfServiceRoutes);
app.use("/api/rag", ragRoutes);
app.use("/api/claims", claimsRoutes);

app.get("/", (_req, res) => {
  res.json({ message: "Candor BFF is running 🚀" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`BFF running on http://localhost:${PORT}`);
});
