const Submission = require('../models/Submission');
const Course = require('../models/Course');
const Student = require('../models/Student');

// POST /api/submissions  (student, multipart/form-data with "voucher" file)
const createSubmission = async (req, res, next) => {
  try {
    const { semester, courseIds } = req.body;
    const student = await Student.findById(req.user.id);

    if (!semester) {
      return res.status(400).json({ message: 'Semester is required.' });
    }

    let parsedCourseIds = courseIds;
    if (typeof courseIds === 'string') {
      try {
        parsedCourseIds = JSON.parse(courseIds);
      } catch {
        parsedCourseIds = [courseIds];
      }
    }

    if (!Array.isArray(parsedCourseIds) || parsedCourseIds.length === 0) {
      return res.status(400).json({ message: 'Please select at least one course.' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Please upload your voucher.' });
    }

    const semesterNum = Number(semester);

    // Enforce one active (Pending/Approved) submission per student+semester,
    // unless admin has explicitly flagged the last one for resubmission.
    const existing = await Submission.findOne({
      student: student._id,
      semester: semesterNum,
      status: { $in: ['Pending', 'Approved'] },
    });
    if (existing) {
      return res
        .status(409)
        .json({ message: 'This semester has already been submitted.' });
    }

    const rejectedNotAllowed = await Submission.findOne({
      student: student._id,
      semester: semesterNum,
      status: 'Rejected',
      allowResubmission: false,
    });
    if (rejectedNotAllowed) {
      return res.status(409).json({
        message:
          'Your previous submission for this semester was rejected. Please contact admin to enable resubmission.',
      });
    }

    const courses = await Course.find({ _id: { $in: parsedCourseIds } });
    if (courses.length !== parsedCourseIds.length) {
      return res.status(400).json({ message: 'One or more selected courses are invalid.' });
    }

    const courseSnapshots = courses.map((c) => ({
      course: c._id,
      courseCode: c.courseCode,
      courseName: c.courseName,
      creditHours: c.creditHours,
    }));
    const totalCreditHours = courseSnapshots.reduce((sum, c) => sum + c.creditHours, 0);

    const submission = await Submission.create({
      student: student._id,
      semester: semesterNum,
      program: student.program,
      courses: courseSnapshots,
      totalCreditHours,
      voucherImage: `/uploads/vouchers/${req.file.filename}`,
      status: 'Pending',
    });

    res.status(201).json({ message: 'Form submitted successfully.', submission });
  } catch (err) {
    next(err);
  }
};

// GET /api/submissions/my
const getMySubmissions = async (req, res, next) => {
  try {
    const submissions = await Submission.find({ student: req.user.id }).sort({ createdAt: -1 });
    res.json({ submissions });
  } catch (err) {
    next(err);
  }
};

// GET /api/submissions/:id
const getSubmissionById = async (req, res, next) => {
  try {
    const submission = await Submission.findById(req.params.id).populate(
      'student',
      'firstName lastName studentId program email phone'
    );
    if (!submission) return res.status(404).json({ message: 'Submission not found.' });

    // Students may only view their own submission.
    if (req.user.role === 'student' && submission.student._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You are not authorized to view this submission.' });
    }

    res.json({ submission });
  } catch (err) {
    next(err);
  }
};

module.exports = { createSubmission, getMySubmissions, getSubmissionById };
