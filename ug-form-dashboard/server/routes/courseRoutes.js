const express = require('express');
const {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
} = require('../controllers/courseController');
const { protect, requireRole } = require('../middleware/auth');

const router = express.Router();

// Any authenticated user (student or admin) can read courses.
router.get('/', protect, getCourses);
router.get('/:id', protect, getCourseById);

// Only admins can manage courses.
router.post('/', protect, requireRole('admin'), createCourse);
router.put('/:id', protect, requireRole('admin'), updateCourse);
router.delete('/:id', protect, requireRole('admin'), deleteCourse);

module.exports = router;
