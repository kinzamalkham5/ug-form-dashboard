const express = require('express');
const rateLimit = require('express-rate-limit');
const {
  registerStudent,
  loginStudent,
  loginAdmin,
  getMe,
  changePassword,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Slow down brute-force attempts against auth endpoints.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { message: 'Too many attempts. Please try again later.' },
});

router.post('/register', authLimiter, registerStudent);
router.post('/login', authLimiter, loginStudent);
router.post('/admin/login', authLimiter, loginAdmin);
router.get('/me', protect, getMe);
router.put('/change-password', protect, changePassword);

module.exports = router;
