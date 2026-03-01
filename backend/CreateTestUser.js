const pool = require('./config/db');          // your DB connection
const { hashPassword } = require('./utils/hash');  // updated path to utils/hash.js

async function createUser() {
    const username = 'testuser';
    const plainPassword = 'Password123';
    const role_id = 1; // 1 = user, 2 = manager, 3 = admin

    // Hash the password
    const hashed = await hashPassword(plainPassword);

    // Insert into the database
    const result = await pool.query(
        'INSERT INTO users (username, password, role_id) VALUES ($1, $2, $3) RETURNING *',
        [username, hashed, role_id]
    );

    console.log('User created:', result.rows[0]);
    process.exit();
}

createUser();