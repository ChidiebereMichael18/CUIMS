const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: ['student', 'supervisor', 'admin'],
      default: 'student',
    },
    // Student-specific
    studentId: {
      type: String,
      trim: true,
    },
    course: {
      type: String,
      trim: true,
    },
    yearOfStudy: {
      type: Number,
    },
    // Supervisor-specific
    organization: {
      type: String,
      trim: true,
    },
    jobTitle: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    // Admin approves supervisors before they can post internships
    isApproved: {
      type: Boolean,
      default: function () {
        return this.role === 'student' || this.role === 'admin';
      },
    },
    profilePhoto: {
      type: String,
      default: null,
    },
    bio: {
      type: String,
      maxlength: 500,
    },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);