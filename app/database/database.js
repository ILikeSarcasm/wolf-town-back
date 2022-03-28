import mysql from 'mysql2';
import config from './db-config.js';

const RETRY_COOLDOWN = 2000;

var connection;

function connect() {
  connection = mysql.createConnection(config);

  connection.connect(error => {
    if(error) {
      console.error(`database.js ${error}`);
      setTimeout(connect, RETRY_COOLDOWN);
    }
  });

  connection.on('error', function(err) {
    console.error(`database.js ${error}`);
    if(err.code === 'PROTOCOL_CONNECTION_LOST') connect();
    else throw err;
  });
}

export function query(sql, params = []) {
    return new Promise((resolve, reject) => {
        connection.query(sql, params, (err, results, fields) => {
            err ? reject(err) : resolve(results);
        });
    });
}

connect();

const db = { query };

export default db;
