const pool = require('./db');

pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Connection failed', err);
    } else {
        console.log('Connection successful:', res.rows[0]);
    }
    pool.end(); // Close the connection after test
});
