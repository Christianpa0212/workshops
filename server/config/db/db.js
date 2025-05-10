const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error al conectar con la base de datos:', err.message);
  } else {
    console.log(`Base de datos conectada`);
    connection.release();
  }
});

module.exports = pool.promise(); 

