const express = require('express');
const router = express.Router();

const { registerUser, loginUser } = require('../controllers/authController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { allowRoles } = require('../middleware/roleMiddleware');

// Login (public)
router.post('/login', loginUser);

// Register (admin only)
router.post(
    '/register',
    authenticateToken,
    allowRoles('admin'),
    registerUser
);

module.exports = router;