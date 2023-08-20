const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'containers-us-west-31.railway.app',
  port: '6516',
  user: 'root',
  password: 'R9zMFeuawSFwyylXhHGz',
  database: 'railway',
  insecureAuth: true
});

db.connect(err => {
  if (err) throw err;
  console.log('Connected to MySQL Database');
});

module.exports = db;
