const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost", // Ganti dengan host MySQL Anda
  user: "root", // Ganti dengan nama pengguna MySQL Anda
  password: "", // Ganti dengan kata sandi MySQL Anda
  database: "whatsapp", // Ganti dengan nama database Anda
});

module.exports = db;
