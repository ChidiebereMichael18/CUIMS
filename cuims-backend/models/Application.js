const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    internship: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Internship',
      required: true,
    },
    coverLetter: {
      type: String,
      required: [true, 'Cover letter is required'],
    },
    resumeUrl: {
      type: String, // uploaded file path
    },
    status: {
      type: String,
      enum: ['pending', 'reviewing', 'accepted', 'rejected', 'withdrawn'],
      default: 'pending',
    },
    supervisorNote: {
      type: String, // feedback from supervisor on accept/reject
    },
    // Set when accepted - tracks the internship period
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    completionStatus: {
      type: String,
      enum: ['ongoing', 'completed', 'terminated'],
      default: 'ongoing',
    },
  },
  { timestamps: true }
);

// A student can only apply once per internship
applicationSchema.index({ student: 1, internship: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);