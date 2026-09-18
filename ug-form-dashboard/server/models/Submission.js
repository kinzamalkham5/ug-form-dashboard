const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    semester: { type: Number, required: true, min: 1, max: 8 },
    program: { type: String, required: true },
    courses: [
      {
        course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
        courseCode: String,
        courseName: String,
        creditHours: Number,
      },
    ],
    totalCreditHours: { type: Number, required: true },
    voucherImage: { type: String, required: true }, // stored relative path, e.g. /uploads/vouchers/xxx.jpg
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending',
    },
    rejectionReason: { type: String, default: null },
    allowResubmission: { type: Boolean, default: false },
    submittedAt: { type: Date, default: Date.now },
    reviewedAt: { type: Date, default: null },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', default: null },
  },
  { timestamps: true }
);

// One active (Pending or Approved) submission per student+semester, unless admin has
// flagged the previous rejected one for resubmission (handled in application logic,
// since a partial unique index can't easily express "active" without a status filter).
submissionSchema.index({ student: 1, semester: 1 });

module.exports = mongoose.model('Submission', submissionSchema);
