const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const http = require("http");
const User = require("../models/userModel");

/**
 * Fetches a Java-signed token from the Spring Boot service.
 *
 * The Java token is signed with the same secret as the Node token and carries
 * the same claims (sub, role, policyId, deceasedFlag) but is additionally
 * validated against Java's ProfileStore on every request. This means:
 *   - POLICYHOLDER can reach /api/what-if, /api/self-service, /api/rag, /api/claims
 *   - BENEFICIARY is blocked from what-if and self-service at the Java filter level
 *   - If the policy's deceased flag is true, the Java filter demotes the role
 *     to BENEFICIARY regardless of what the token claims
 *
 * Falls back to a Node-only signed token if Java is unreachable (dev convenience).
 */
function fetchJavaToken(subject, policyId, role) {
  return new Promise((resolve) => {
    const body = JSON.stringify({ subject, policyId, requestedRole: role });
    const options = {
      hostname: process.env.JAVA_SERVICE_HOST || "localhost",
      port: parseInt(process.env.JAVA_SERVICE_PORT || "8080", 10),
      path: "/api/dev/mock-token",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(body),
      },
    };
    const req = http.request(options, (res) => {
      let raw = "";
      res.on("data", (c) => { raw += c; });
      res.on("end", () => {
        try {
          const parsed = JSON.parse(raw);
          resolve(parsed.token || null);
        } catch {
          resolve(null);
        }
      });
    });
    req.on("error", () => resolve(null));
    req.setTimeout(5000, () => { req.destroy(); resolve(null); });
    req.write(body);
    req.end();
  });
}

exports.register = async (req, res) => {
  try {
    const { first_name, last_name, email, username, password, role } = req.body;

    const emailExists = await User.findUserByEmail(email);
    if (emailExists) return res.status(400).json({ message: "Email already exists" });

    const usernameExists = await User.findUserByUsername(username);
    if (usernameExists) return res.status(400).json({ message: "Username already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    // Normalize to ROLE_POLICYHOLDER / ROLE_BENEFICIARY for DB storage
    const normalizedRole =
      role === "beneficiary" || role === "ROLE_BENEFICIARY"
        ? "ROLE_BENEFICIARY"
        : "ROLE_POLICYHOLDER";

    const user = await User.createUser({
      first_name,
      last_name,
      email,
      username,
      password: hashedPassword,
      role: normalizedRole,
      deceased_flag: false,
      // policy_id auto-generated in userModel if not provided
    });

    res.status(201).json({ message: "User created successfully", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findUserByEmail(email);
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) return res.status(401).json({ message: "Invalid credentials" });

    const secret = process.env.JWT_SECRET || process.env.MOCK_JWT_SIGNING_SECRET;
    if (!secret) {
      console.error("JWT_SECRET / MOCK_JWT_SIGNING_SECRET is not configured");
      return res.status(500).json({ message: "Auth misconfigured" });
    }

    // Strip "ROLE_" prefix — Java's MockJwtService expects "POLICYHOLDER" / "BENEFICIARY"
    const javaRole = (user.role || "ROLE_POLICYHOLDER").replace(/^ROLE_/, "");

    // Use the user's own stable policy_id — assigned at registration.
    const policyId = user.policy_id;

    // subject is a stable identifier for this user — used by Java's
    // JwtAuthenticationFilter as the CompanionPrincipal subject.
    //
    // The 3 demo users map directly to Java's ProfileStore seeds so their
    // tokens are accepted by the Spring Boot filter end-to-end.
    // All other users get a dynamic subject and fall back to a Node-signed token.
    const DEMO_SUBJECT_MAP = {
      "sipho@candor.co.za": "sipho-policyholder-1001",   // POL-1001 active policyholder
      "lerato@candor.co.za": "lerato-beneficiary-2002",   // POL-2002 active beneficiary
      "thandi@candor.co.za": "thandi-beneficiary-3003",   // POL-3003 deceased — empathetic mode
    };
    const subject = DEMO_SUBJECT_MAP[user.email] || `user-${javaRole.toLowerCase()}-${user.id}`;

    // Try to get a Java-signed token so it works end-to-end with Spring Boot.
    // Java's /api/dev/mock-token requires the policyId to exist in ProfileStore.
    // For users with dynamically generated policyIds (not in the seeded store),
    // Java returns an error and we fall back to a Node-signed token — which is
    // still valid for all Node BFF endpoints (/api/chat, /api/auth, etc.).
    let token = await fetchJavaToken(subject, policyId, javaRole);

    if (!token) {
      // Node-signed fallback — carries the same claims so downstream
      // middleware (auth.js, requireRole.js) works identically.
      token = jwt.sign(
        {
          id: user.id,
          sub: subject,
          email: user.email,
          role: javaRole,
          policyId,
          deceasedFlag: !!user.deceased_flag,
          iss: "https://companion.candor.local/mock-idp",
          aud: "candor-life-companion",
        },
        secret,
        { expiresIn: "1h" }
      );
    }

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        username: user.username,
        role: user.role,          // "ROLE_POLICYHOLDER" or "ROLE_BENEFICIARY"
        policyId,
        deceasedFlag: user.deceased_flag,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};
