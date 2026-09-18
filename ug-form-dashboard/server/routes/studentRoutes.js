const express = require('express');
const { getProfile, updateProfile, getDashboardStats } = require('../controllers/studentController');
const { protect, requireRole } = require('../middleware/auth');

const router = express.Router();

router.use(protect, requireRole('student'));

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.get('/dashboard-stats', getDashboardStats);

module.exports = router;
