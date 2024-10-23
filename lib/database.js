// import dotenv from 'dotenv';
// dotenv.config();
import mysql from 'mysql2/promise';

const connection = mysql.createConnection({
  host: '172.18.0.2',
  user: 'root',
  password: 'IOtSt4ckToorMariaDb',
  database: 'igrow',
  port: 3306,
});

export default connection;
