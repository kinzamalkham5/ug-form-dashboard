const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema(
  {
    courseCode: { type: String, required: true, trim: true, uppercase: true },
    courseName: { type: String, required: true, trim: true },
    creditHours: { type: Number, required: true, min: 1, max: 6 },
    semester: { type: Number, required: true, min: 1, max: 8 },
    program: { type: String, required: true, trim: true },
    isDemoData: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// A course code should be unique within a given program + semester
courseSchema.index({ courseCode: 1, program: 1, semester: 1 }, { unique: true });

module.exports = mongoose.model('Course', courseSchema);
