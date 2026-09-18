const Student = require('../models/Student');
const Admin = require('../models/Admin');
const generateToken = require('../utils/generateToken');

// POST /api/auth/register  (student)
const registerStudent = async (req, res, next) => {
  try {
    const { firstName, lastName, cnic, phone, email, password, studentId, program, semester } =
      req.body;

    if (!firstName || !lastName || !cnic || !phone || !email || !password || !studentId || !program || !semester) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const existing = await Student.findOne({ $or: [{ email }, { cnic }, { studentId }] });
    if (existing) {
      if (existing.email === email.toLowerCase()) {
        return res.status(409).json({ message: 'This email is already registered.' });
      }
      if (existing.cnic === cnic) {
        return res.status(409).json({ message: 'This CNIC is already registered.' });
      }
      return res.status(409).json({ message: 'This Student ID already exists.' });
    }

    const student = await Student.create({
      firstName,
      lastName,
      cnic,
      phone,
      email,
      password,
      studentId,
      program,
      semester,
    });

    res.status(201).json({
      message: 'Registration successful. Please log in.',
      student: student.toSafeJSON(),
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/login  (student)
const loginStudent = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const student = await Student.findOne({ email: email.toLowerCase() }).select('+password');
    if (!student || !(await student.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = generateToken(student._id, 'student');
    res.json({ token, student: student.toSafeJSON() });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/admin/login
const loginAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const admin = await Admin.findOne({ email: email.toLowerCase() }).select('+password');
    if (!admin || !(await admin.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = generateToken(admin._id, 'admin');
    res.json({ token, admin: admin.toSafeJSON() });
  } catch (err) {
    next(err);
  }
};

// GET /api/auth/me
const getMe = async (req, res, next) => {
  try {
    if (req.user.role === 'student') {
      const student = await Student.findById(req.user.id);
      return res.json({ role: 'student', student: student.toSafeJSON() });
    }
    const admin = await Admin.findById(req.user.id);
    return res.json({ role: 'admin', admin: admin.toSafeJSON() });
  } catch (err) {
    next(err);
  }
};

// PUT /api/auth/change-password
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current and new password are required.' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters.' });
    }

    const Model = req.user.role === 'admin' ? Admin : Student;
    const account = await Model.findById(req.user.id).select('+password');

    if (!(await account.comparePassword(currentPassword))) {
      return res.status(401).json({ message: 'Current password is incorrect.' });
    }

    account.password = newPassword;
    await account.save();
    res.json({ message: 'Password updated successfully.' });
  } catch (err) {
    next(err);
  }
};

module.exports = { registerStudent, loginStudent, loginAdmin, getMe, changePassword };
