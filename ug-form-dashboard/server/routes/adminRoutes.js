const express = require('express');
const {
  getDashboardStats,
  getStudents,
  getStudentById,
  getSubmissions,
  approveSubmission,
  rejectSubmission,
  allowResubmission,
} = require('../controllers/adminController');
const { protect, requireRole } = require('../middleware/auth');

const router = express.Router();

router.use(protect, requireRole('admin'));

router.get('/dashboard-stats', getDashboardStats);
router.get('/students', getStudents);
router.get('/students/:id', getStudentById);
router.get('/submissions', getSubmissions);
router.put('/submissions/:id/approve', approveSubmission);
router.put('/submissions/:id/reject', rejectSubmission);
router.put('/submissions/:id/allow-resubmission', allowResubmission);

module.exports = router;
