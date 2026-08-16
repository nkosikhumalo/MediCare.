const db = require("../database/db");

async function createUser(user) {
  const {
    first_name,
    last_name,
    email,
    username,
    password,
    role,
  } = user;

  return db.createUser({
    first_name,
    last_name,
    email,
    username,
    password,
    role,
  });
}

async function findUserByEmail(email) {
  return db.findUserByEmail(email);
}

async function findUserByUsername(username) {
  return db.findUserByUsername(username);
}

module.exports = {
  createUser,
  findUserByEmail,
  findUserByUsername,
};