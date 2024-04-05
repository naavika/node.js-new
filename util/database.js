const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'node-new-complete',
    password: 'NRS842@&$#sha*'
});

module.exports = pool.promise();