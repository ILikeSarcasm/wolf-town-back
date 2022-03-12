import mysql from 'mysql';
import config from './config.js';

export function query(sql, params = []) {
    return new Promise((resolve, reject) => {
        connection.query(sql, params, (err, results, fields) => {
            err ? reject(err) : resolve(results);
        });
    });
}

const db = { query };

export default db;
