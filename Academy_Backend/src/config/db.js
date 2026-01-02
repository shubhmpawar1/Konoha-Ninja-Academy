const { Pool } = require('pg');
require('dotenv').config();

// Create a pool using the DATABASE_URL from Render
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false // Required for Render PostgreSQL
    }
});

module.exports = pool;
