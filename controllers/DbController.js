const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost", // Ganti dengan host MySQL Anda
  user: "restu", // Ganti dengan nama pengguna MySQL Anda
  password: "hokya4", // Ganti dengan kata sandi MySQL Anda
  database: "wa", // Ganti dengan nama database Anda
});

module.exports = db;
