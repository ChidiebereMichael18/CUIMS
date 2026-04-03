const mongoose = require('mongoose');

const internshipSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Internship title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    type: {
      type: String,
      enum: ['on-site', 'remote', 'hybrid'],
      default: 'on-site',
    },
    duration: {
      type: String, // e.g. "3 months", "12 weeks"
      required: [true, 'Duration is required'],
    },
    startDate: {
      type: Date,
    },
    applicationDeadline: {
      type: Date,
      required: [true, 'Application deadline is required'],
    },
    slots: {
      type: Number,
      required: [true, 'Number of available slots is required'],
      min: 1,
    },
    skills: [
      {
        type: String,
        trim: true,
      },
    ],
    requirements: {
      type: String,
    },
    benefits: {
      type: String,
    },
    stipend: {
      type: String, // e.g. "Unpaid", "500 USD/month"
      default: 'Unpaid',
    },
    status: {
      type: String,
      enum: ['open', 'closed', 'draft'],
      default: 'open',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    acceptedStudents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  { timestamps: true }
);

// Auto-close when deadline passes
internshipSchema.index({ applicationDeadline: 1 });

module.exports = mongoose.model('Internship', internshipSchema);