const mysql = require("mysql2/promise");
require("dotenv").config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  port: process.env.DB_PORT || 16275,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

module.exports = pool;
