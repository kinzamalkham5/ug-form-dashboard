const express = require('express');
const {
  createSubmission,
  getMySubmissions,
  getSubmissionById,
} = require('../controllers/submissionController');
const { protect, requireRole } = require('../middleware/auth');
const uploadVoucher = require('../middleware/upload');

const router = express.Router();

router.post('/', protect, requireRole('student'), uploadVoucher.single('voucher'), createSubmission);
router.get('/my', protect, requireRole('student'), getMySubmissions);
router.get('/:id', protect, getSubmissionById); // student (own) or admin

module.exports = router;
