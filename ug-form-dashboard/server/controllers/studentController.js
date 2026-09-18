const Student = require('../models/Student');
const Submission = require('../models/Submission');

// GET /api/students/profile
const getProfile = async (req, res, next) => {
  try {
    const student = await Student.findById(req.user.id);
    res.json({ student: student.toSafeJSON() });
  } catch (err) {
    next(err);
  }
};

// PUT /api/students/profile
// Only non-sensitive fields can be edited. CNIC and Student ID are locked.
const updateProfile = async (req, res, next) => {
  try {
    const { firstName, lastName, phone } = req.body;
    const student = await Student.findById(req.user.id);

    if (firstName) student.firstName = firstName;
    if (lastName) student.lastName = lastName;
    if (phone) student.phone = phone;

    await student.save();
    res.json({ message: 'Profile updated.', student: student.toSafeJSON() });
  } catch (err) {
    next(err);
  }
};

// GET /api/students/dashboard-stats
const getDashboardStats = async (req, res, next) => {
  try {
    const studentId = req.user.id;
    const [total, pending, approved, rejected] = await Promise.all([
      Submission.countDocuments({ student: studentId }),
      Submission.countDocuments({ student: studentId, status: 'Pending' }),
      Submission.countDocuments({ student: studentId, status: 'Approved' }),
      Submission.countDocuments({ student: studentId, status: 'Rejected' }),
    ]);

    const recent = await Submission.find({ student: studentId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('semester status submittedAt totalCreditHours');

    res.json({ stats: { total, pending, approved, rejected }, recent });
  } catch (err) {
    next(err);
  }
};

module.exports = { getProfile, updateProfile, getDashboardStats };
