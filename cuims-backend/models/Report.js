const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema(
  {
    application: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Application',
      required: true,
    },
    internship: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Internship',
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    authorRole: {
      type: String,
      enum: ['student', 'supervisor'],
      required: true,
    },
    weekNumber: {
      type: Number,
      required: [true, 'Week number is required'],
      min: 1,
    },
    title: {
      type: String,
      required: [true, 'Report title is required'],
      trim: true,
    },
    // For student reports
    activitiesCarriedOut: {
      type: String,
    },
    skillsLearned: {
      type: String,
    },
    challenges: {
      type: String,
    },
    goalsForNextWeek: {
      type: String,
    },
    // For supervisor reports
    studentPerformance: {
      type: String,
    },
    areasOfImprovement: {
      type: String,
    },
    overallFeedback: {
      type: String,
    },
    // Shared
    generalContent: {
      type: String,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    attachments: [
      {
        filename: String,
        url: String,
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

// One report per author per week per application
reportSchema.index({ application: 1, author: 1, weekNumber: 1 }, { unique: true });

module.exports = mongoose.model('Report', reportSchema);