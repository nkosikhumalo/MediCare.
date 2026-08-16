const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

let initialized = false;

async function initializeSchema() {
  if (initialized) return;

  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      first_name VARCHAR(100),
      last_name VARCHAR(100),
      email VARCHAR(255) UNIQUE NOT NULL,
      username VARCHAR(100) UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role VARCHAR(50) DEFAULT 'policy_holder',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS conversations (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      title VARCHAR(255) DEFAULT 'New Conversation',
      preview TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS messages (
      id SERIAL PRIMARY KEY,
      conversation_id INTEGER NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
      sender VARCHAR(20) NOT NULL,
      message TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  initialized = true;
}

async function connect() {
  try {
    await pool.query("SELECT NOW()");
    await initializeSchema();
    console.log("✅ Connected to PostgreSQL");
  } catch (error) {
    console.error("❌ PostgreSQL connection error:", error.message);
  }
}

connect();

async function createUser(user) {
  await initializeSchema();

  const { first_name, last_name, email, username, password, role } = user;

  const existing = await findUserByEmail(email);
  if (existing) {
    return null;
  }

  const result = await pool.query(
    `
      INSERT INTO users (first_name, last_name, email, username, password, role)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, first_name, last_name, email, username, role, created_at
    `,
    [first_name, last_name, email, username, password, role || "policy_holder"]
  );

  return result.rows[0];
}

async function findUserByEmail(email) {
  await initializeSchema();
  const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
  return result.rows[0] || null;
}

async function findUserByUsername(username) {
  await initializeSchema();
  const result = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
  return result.rows[0] || null;
}

async function createConversation({ user_id, title }) {
  await initializeSchema();
  const result = await pool.query(
    `
      INSERT INTO conversations (user_id, title, preview, created_at, updated_at)
      VALUES ($1, $2, $3, NOW(), NOW())
      RETURNING *
    `,
    [user_id, title || "New Conversation", ""]
  );
  return result.rows[0];
}

async function getConversations(userId) {
  await initializeSchema();
  const result = await pool.query(
    "SELECT * FROM conversations WHERE user_id = $1 ORDER BY updated_at DESC",
    [userId]
  );
  return result.rows;
}

async function getMessages(conversationId) {
  await initializeSchema();
  const result = await pool.query(
    "SELECT * FROM messages WHERE conversation_id = $1 ORDER BY created_at ASC",
    [conversationId]
  );
  return result.rows;
}

async function saveMessage({ conversation_id, sender, message }) {
  await initializeSchema();

  const result = await pool.query(
    `
      INSERT INTO messages (conversation_id, sender, message)
      VALUES ($1, $2, $3)
      RETURNING *
    `,
    [conversation_id, sender, message]
  );

  await pool.query(
    `
      UPDATE conversations
      SET preview = $1, updated_at = NOW()
      WHERE id = $2
    `,
    [message, conversation_id]
  );

  await pool.query(
    `
      UPDATE conversations
      SET title = $1
      WHERE id = $2
      AND title = 'New Conversation'
    `,
    [message.length > 40 ? `${message.substring(0, 40)}...` : message, conversation_id]
  );

  return result.rows[0];
}

module.exports = {
  pool,
  createUser,
  findUserByEmail,
  findUserByUsername,
  createConversation,
  getConversations,
  getMessages,
  saveMessage,
};