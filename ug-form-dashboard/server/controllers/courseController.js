const Course = require('../models/Course');

// GET /api/courses?program=...&semester=...
const getCourses = async (req, res, next) => {
  try {
    const { program, semester } = req.query;
    const filter = {};
    if (program) filter.program = program;
    if (semester) filter.semester = Number(semester);

    const courses = await Course.find(filter).sort({ semester: 1, courseCode: 1 });
    res.json({ courses });
  } catch (err) {
    next(err);
  }
};

// GET /api/courses/:id
const getCourseById = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found.' });
    res.json({ course });
  } catch (err) {
    next(err);
  }
};

// POST /api/courses  (admin)
const createCourse = async (req, res, next) => {
  try {
    const { courseCode, courseName, creditHours, semester, program } = req.body;
    if (!courseCode || !courseName || !creditHours || !semester || !program) {
      return res.status(400).json({ message: 'All course fields are required.' });
    }
    const course = await Course.create({ courseCode, courseName, creditHours, semester, program });
    res.status(201).json({ message: 'Course created.', course });
  } catch (err) {
    next(err);
  }
};

// PUT /api/courses/:id  (admin)
const updateCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found.' });

    const { courseCode, courseName, creditHours, semester, program } = req.body;
    if (courseCode) course.courseCode = courseCode;
    if (courseName) course.courseName = courseName;
    if (creditHours) course.creditHours = creditHours;
    if (semester) course.semester = semester;
    if (program) course.program = program;

    await course.save();
    res.json({ message: 'Course updated.', course });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/courses/:id  (admin)
const deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found.' });
    res.json({ message: 'Course deleted.' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getCourses, getCourseById, createCourse, updateCourse, deleteCourse };
