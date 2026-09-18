// Converts common Mongoose/JS errors into clean, user-friendly JSON responses.
const errorHandler = (err, req, res, next) => {
  console.error(err);

  // Duplicate key (unique index) violation
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || err.keyValue || { field: 1 })[0];
    const friendly = {
      email: 'This email is already registered.',
      cnic: 'This CNIC is already registered.',
      studentId: 'This Student ID already exists.',
      courseCode: 'This course code already exists for this program/semester.',
    };
    return res.status(409).json({ message: friendly[field] || `${field} already exists.` });
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ message: messages[0] || 'Validation failed.', errors: messages });
  }

  // Invalid ObjectId cast
  if (err.name === 'CastError') {
    return res.status(400).json({ message: 'Invalid ID format.' });
  }

  // Multer file errors
  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File size must be less than 5MB.' });
    }
    return res.status(400).json({ message: err.message });
  }

  const status = err.statusCode || 500;
  const message = err.message || 'Something went wrong on the server.';
  res.status(status).json({ message });
};

// 404 handler for unmatched routes
const notFound = (req, res) => {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
};

module.exports = { errorHandler, notFound };
