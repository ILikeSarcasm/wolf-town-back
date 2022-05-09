import mysql from 'mysql2';
import config from './db-config.js';

const RETRY_COOLDOWN = 2000;

var connection;

function connect() {
  console.log(`database.js Connecting database`);
  if (process.env.ENVIRONMENT === 'local') return;
  connection = mysql.createConnection(config);

  connection.connect(error => {
    if(error) {
      console.error(`database.js ${error}`);
      setTimeout(connect, RETRY_COOLDOWN);
    }
  });

  connection.on('error', function(error) {
    console.error(`database.js ${error}`);
    if(error.code === 'PROTOCOL_CONNECTION_LOST') connect();
    else throw error;
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
