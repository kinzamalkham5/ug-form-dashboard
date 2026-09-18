const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const CNIC_REGEX = /^\d{5}-\d{7}-\d{1}$/;
const PK_PHONE_REGEX = /^(03\d{9}|\+923\d{9})$/;

const studentSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true, maxlength: 60 },
    lastName: { type: String, required: true, trim: true, maxlength: 60 },
    cnic: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      validate: {
        validator: (v) => CNIC_REGEX.test(v),
        message: 'CNIC must be in the format 12345-1234567-1',
      },
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: (v) => PK_PHONE_REGEX.test(v),
        message: 'Phone must be a valid Pakistani number, e.g. 03001234567 or +923001234567',
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email address'],
    },
    password: { type: String, required: true, minlength: 6, select: false },
    studentId: { type: String, required: true, unique: true, trim: true },
    program: { type: String, required: true, trim: true },
    semester: { type: Number, required: true, min: 1, max: 8 },
    role: { type: String, default: 'student', immutable: true },
  },
  { timestamps: true }
);

studentSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

studentSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

studentSchema.methods.toSafeJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('Student', studentSchema);
