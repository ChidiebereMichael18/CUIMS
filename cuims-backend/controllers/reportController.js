const Report = require('../models/Report');
const Application = require('../models/Application');
const Internship = require('../models/Internship');

// @desc    Submit a weekly report
// @route   POST /api/reports
// @access  Student & Supervisor
exports.submitReport = async (req, res) => {
  try {
    const {
      applicationId,
      weekNumber,
      title,
      activitiesCarriedOut,
      skillsLearned,
      challenges,
      goalsForNextWeek,
      studentPerformance,
      areasOfImprovement,
      overallFeedback,
      generalContent,
      rating,
    } = req.body;

    const application = await Application.findById(applicationId).populate('internship');

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    if (application.status !== 'accepted') {
      return res.status(400).json({ success: false, message: 'Reports can only be submitted for active internships' });
    }

    // Verify access: must be the intern OR the internship supervisor
    const isSupervisor = application.internship.createdBy.toString() === req.user.id;
    const isStudent = application.student.toString() === req.user.id;

    if (!isSupervisor && !isStudent) {
      return res.status(403).json({ success: false, message: 'Not authorized to submit a report for this application' });
    }

    const attachments = req.files
      ? req.files.map((file) => ({
          filename: file.originalname,
          url: `/uploads/${file.filename}`,
        }))
      : [];

    const report = await Report.create({
      application: applicationId,
      internship: application.internship._id,
      author: req.user.id,
      authorRole: req.user.role,
      weekNumber,
      title,
      activitiesCarriedOut,
      skillsLearned,
      challenges,
      goalsForNextWeek,
      studentPerformance,
      areasOfImprovement,
      overallFeedback,
      generalContent,
      rating,
      attachments,
    });

    await report.populate('author', 'name role');

    res.status(201).json({ success: true, report });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted a report for this week. Edit it instead.',
      });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all reports for an application (both student & supervisor)
// @route   GET /api/reports/application/:applicationId
// @access  Student (own) | Supervisor (their internship)
exports.getReportsByApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.applicationId).populate('internship');

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    const isSupervisor = application.internship.createdBy.toString() === req.user.id;
    const isStudent = application.student.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (!isSupervisor && !isStudent && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const reports = await Report.find({ application: req.params.applicationId })
      .populate('author', 'name role organization studentId')
      .sort({ weekNumber: 1, authorRole: 1 });

    // Group by week for convenience
    const byWeek = {};
    reports.forEach((r) => {
      if (!byWeek[r.weekNumber]) byWeek[r.weekNumber] = { week: r.weekNumber, student: null, supervisor: null };
      byWeek[r.weekNumber][r.authorRole] = r;
    });

    res.json({
      success: true,
      reports,
      byWeek: Object.values(byWeek).sort((a, b) => a.week - b.week),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all reports submitted by logged-in user
// @route   GET /api/reports/my
// @access  Student & Supervisor
exports.getMyReports = async (req, res) => {
  try {
    const reports = await Report.find({ author: req.user.id })
      .populate('internship', 'title company')
      .populate('application')
      .sort({ createdAt: -1 });

    res.json({ success: true, reports });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a report
// @route   PUT /api/reports/:id
// @access  Report author only
exports.updateReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }

    if (report.author.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to edit this report' });
    }

    const updated = await Report.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('author', 'name role');

    res.json({ success: true, report: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all reports for supervisor's internships
// @route   GET /api/reports/supervisor-overview
// @access  Supervisor only
exports.getSupervisorReportsOverview = async (req, res) => {
  try {
    const myInternships = await Internship.find({ createdBy: req.user.id }).select('_id title');
    const internshipIds = myInternships.map((i) => i._id);

    const reports = await Report.find({ internship: { $in: internshipIds } })
      .populate('author', 'name role studentId')
      .populate('internship', 'title company')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: reports.length, reports });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};