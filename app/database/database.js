import mysql from 'mysql2';
import config from './db-config.js';

const connection = mysql.createConnection(config);

export function query(sql, params = []) {
    return new Promise((resolve, reject) => {
        connection.query(sql, params, (err, results, fields) => {
            err ? reject(err) : resolve(results);
        });
    });
}

const db = { query };

export default db;
