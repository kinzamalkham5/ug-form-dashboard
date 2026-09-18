const jwt = require('jsonwebtoken');
const Student = require('../models/Student');
const Admin = require('../models/Admin');

// Verifies the JWT and attaches { id, role } to req.user.
// Does NOT trust any role sent from the client body/query — only the signed token.
const protect = async (req, res, next) => {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;

    if (!token) {
      return res.status(401).json({ message: 'Not authenticated. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    let account = null;
    if (decoded.role === 'admin') {
      account = await Admin.findById(decoded.id);
    } else if (decoded.role === 'student') {
      account = await Student.findById(decoded.id);
    }

    if (!account) {
      return res.status(401).json({ message: 'Account no longer exists.' });
    }

    req.user = { id: account._id.toString(), role: decoded.role, account };
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

// Restricts a route to one or more roles, e.g. requireRole('admin')
const requireRole = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'You are not authorized to perform this action.' });
  }
  next();
};

module.exports = { protect, requireRole };
