const Student = require('../models/Student');
const Submission = require('../models/Submission');
const Course = require('../models/Course');

// GET /api/admin/dashboard-stats
const getDashboardStats = async (req, res, next) => {
  try {
    const [totalStudents, totalSubmissions, pending, approved, rejected] = await Promise.all([
      Student.countDocuments(),
      Submission.countDocuments(),
      Submission.countDocuments({ status: 'Pending' }),
      Submission.countDocuments({ status: 'Approved' }),
      Submission.countDocuments({ status: 'Rejected' }),
    ]);
    res.json({ stats: { totalStudents, totalSubmissions, pending, approved, rejected } });
  } catch (err) {
    next(err);
  }
};

// GET /api/admin/students?search=&program=&semester=
const getStudents = async (req, res, next) => {
  try {
    const { search, program, semester } = req.query;
    const filter = {};
    if (program) filter.program = program;
    if (semester) filter.semester = Number(semester);
    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { studentId: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { cnic: { $regex: search, $options: 'i' } },
      ];
    }
    const students = await Student.find(filter).sort({ createdAt: -1 });
    res.json({ students });
  } catch (err) {
    next(err);
  }
};

// GET /api/admin/students/:id
const getStudentById = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found.' });
    const submissions = await Submission.find({ student: student._id }).sort({ createdAt: -1 });
    res.json({ student: student.toSafeJSON(), submissions });
  } catch (err) {
    next(err);
  }
};

// GET /api/admin/submissions?status=&semester=&program=
const getSubmissions = async (req, res, next) => {
  try {
    const { status, semester, program } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (semester) filter.semester = Number(semester);
    if (program) filter.program = program;

    const submissions = await Submission.find(filter)
      .populate('student', 'firstName lastName studentId program email phone')
      .sort({ createdAt: -1 });
    res.json({ submissions });
  } catch (err) {
    next(err);
  }
};

// PUT /api/admin/submissions/:id/approve
const approveSubmission = async (req, res, next) => {
  try {
    const submission = await Submission.findById(req.params.id);
    if (!submission) return res.status(404).json({ message: 'Submission not found.' });

    submission.status = 'Approved';
    submission.rejectionReason = null;
    submission.reviewedAt = new Date();
    submission.reviewedBy = req.user.id;
    await submission.save();

    res.json({ message: 'Submission approved.', submission });
  } catch (err) {
    next(err);
  }
};

// PUT /api/admin/submissions/:id/reject
const rejectSubmission = async (req, res, next) => {
  try {
    const { reason } = req.body;
    if (!reason || !reason.trim()) {
      return res.status(400).json({ message: 'A rejection reason is required.' });
    }

    const submission = await Submission.findById(req.params.id);
    if (!submission) return res.status(404).json({ message: 'Submission not found.' });

    submission.status = 'Rejected';
    submission.rejectionReason = reason.trim();
    submission.reviewedAt = new Date();
    submission.reviewedBy = req.user.id;
    await submission.save();

    res.json({ message: 'Submission rejected.', submission });
  } catch (err) {
    next(err);
  }
};

// PUT /api/admin/submissions/:id/allow-resubmission
const allowResubmission = async (req, res, next) => {
  try {
    const submission = await Submission.findById(req.params.id);
    if (!submission) return res.status(404).json({ message: 'Submission not found.' });
    if (submission.status !== 'Rejected') {
      return res.status(400).json({ message: 'Only rejected submissions can be reopened for resubmission.' });
    }
    submission.allowResubmission = true;
    await submission.save();
    res.json({ message: 'Student may now resubmit for this semester.', submission });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getDashboardStats,
  getStudents,
  getStudentById,
  getSubmissions,
  approveSubmission,
  rejectSubmission,
  allowResubmission,
};
