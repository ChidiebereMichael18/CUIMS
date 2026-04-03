const Application = require('../models/Application');
const Internship = require('../models/Internship');

// @desc    Apply for an internship
// @route   POST /api/applications
// @access  Student only
exports.applyForInternship = async (req, res) => {
  try {
    const { internshipId, coverLetter } = req.body;

    const internship = await Internship.findById(internshipId);
    if (!internship) {
      return res.status(404).json({ success: false, message: 'Internship not found' });
    }

    if (internship.status !== 'open') {
      return res.status(400).json({ success: false, message: 'This internship is no longer accepting applications' });
    }

    if (new Date() > new Date(internship.applicationDeadline)) {
      return res.status(400).json({ success: false, message: 'Application deadline has passed' });
    }

    const existing = await Application.findOne({ student: req.user.id, internship: internshipId });
    if (existing) {
      return res.status(400).json({ success: false, message: 'You have already applied for this internship' });
    }

    const application = await Application.create({
      student: req.user.id,
      internship: internshipId,
      coverLetter,
      resumeUrl: req.file ? `/uploads/${req.file.filename}` : null,
    });

    await application.populate('internship', 'title company location');
    await application.populate('student', 'name email studentId');

    res.status(201).json({ success: true, application });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'You have already applied for this internship' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get student's own applications
// @route   GET /api/applications/my
// @access  Student only
exports.getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ student: req.user.id })
      .populate('internship', 'title company location type duration stipend status')
      .sort({ createdAt: -1 });

    res.json({ success: true, applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all applications for a specific internship (supervisor)
// @route   GET /api/applications/internship/:internshipId
// @access  Supervisor only
exports.getApplicationsByInternship = async (req, res) => {
  try {
    const internship = await Internship.findById(req.params.internshipId);

    if (!internship) {
      return res.status(404).json({ success: false, message: 'Internship not found' });
    }

    if (internship.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const applications = await Application.find({ internship: req.params.internshipId })
      .populate('student', 'name email studentId course yearOfStudy phone bio')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: applications.length, applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all interns for a supervisor (accepted applications across all their internships)
// @route   GET /api/applications/my-interns
// @access  Supervisor only
exports.getMyInterns = async (req, res) => {
  try {
    const myInternships = await Internship.find({ createdBy: req.user.id }).select('_id');
    const internshipIds = myInternships.map((i) => i._id);

    const applications = await Application.find({
      internship: { $in: internshipIds },
      status: 'accepted',
    })
      .populate('student', 'name email studentId course yearOfStudy phone')
      .populate('internship', 'title company location duration startDate');

    res.json({ success: true, count: applications.length, interns: applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Review an application (accept / reject)
// @route   PUT /api/applications/:id/review
// @access  Supervisor only
exports.reviewApplication = async (req, res) => {
  try {
    const { status, supervisorNote, startDate, endDate } = req.body;

    if (!['accepted', 'rejected', 'reviewing'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }

    const application = await Application.findById(req.params.id).populate('internship');

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    if (application.internship.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to review this application' });
    }

    // Check slot availability on accept
    if (status === 'accepted') {
      const internship = application.internship;
      const acceptedCount = await Application.countDocuments({
        internship: internship._id,
        status: 'accepted',
      });

      if (acceptedCount >= internship.slots) {
        return res.status(400).json({ success: false, message: 'All slots for this internship are filled' });
      }

      // Add student to acceptedStudents on the internship
      await Internship.findByIdAndUpdate(internship._id, {
        $addToSet: { acceptedStudents: application.student },
      });
    }

    application.status = status;
    application.supervisorNote = supervisorNote || '';
    if (startDate) application.startDate = startDate;
    if (endDate) application.endDate = endDate;
    await application.save();

    await application.populate('student', 'name email studentId');

    res.json({ success: true, application });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Withdraw an application
// @route   PUT /api/applications/:id/withdraw
// @access  Student only
exports.withdrawApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    if (application.student.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    if (application.status === 'accepted') {
      return res.status(400).json({ success: false, message: 'Cannot withdraw an accepted application. Contact your supervisor.' });
    }

    application.status = 'withdrawn';
    await application.save();

    res.json({ success: true, message: 'Application withdrawn', application });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};