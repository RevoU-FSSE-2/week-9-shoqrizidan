const mysql = require('mysql');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'zd2108',
  database: 'szmbanking'
});

db.connect(err => {
  if (err) throw err;
  console.log('Connected to MySQL Database');
});

module.exports = db;
