const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./database/db");

const authRoutes = require("./routes/authRoutes");
const chatRoutes = require("./routes/chatRoutes");
const whatIfRoutes = require("./routes/whatIfRoutes");
const selfServiceRoutes = require("./routes/selfServiceRoutes");
const ragRoutes = require("./routes/ragRoutes");
const claimsRoutes = require("./routes/claimsRoutes");

const app = express();

app.use(cors());
app.use(express.json());

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

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`BFF running on http://localhost:${PORT}`);
});
