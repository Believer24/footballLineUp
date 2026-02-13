const mysql = require('mysql2/promise');
require('dotenv').config();

(async () => {
    console.log(`Attempting to connect to ${process.env.DB_HOST} as ${process.env.DB_USER}...`);
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
        });
        console.log('Successfully connected to the database.');
        await connection.end();
    } catch (err) {
        console.error('Connection failed:', err);
    }
})();
