const User = require('../models/User');
const Internship = require('../models/Internship');
const Application = require('../models/Application');
const Report = require('../models/Report');

// @desc    Get dashboard statistics
// @route   GET /api/admin/stats
// @access  Admin
exports.getStats = async (req, res) => {
  try {
    const studentsCount = await User.countDocuments({ role: 'student' });
    const supervisorsCount = await User.countDocuments({ role: 'supervisor' });
    const pendingSupervisors = await User.countDocuments({ role: 'supervisor', isApproved: false });
    
    const totalInternships = await Internship.countDocuments();
    const openInternships = await Internship.countDocuments({ status: 'open' });
    
    const totalApplications = await Application.countDocuments();
    const acceptedApplications = await Application.countDocuments({ status: 'accepted' });
    
    const totalReports = await Report.countDocuments();

    res.json({
      success: true,
      stats: {
        totalUsers: studentsCount + supervisorsCount,
        totalStudents: studentsCount,
        totalSupervisors: supervisorsCount,
        pendingSupervisors,
        totalInternships,
        openInternships,
        totalApplications,
        acceptedApplications,
        totalReports,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Admin
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Approve a supervisor account
// @route   PUT /api/admin/users/:id/approve
// @access  Admin
exports.approveSupervisor = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    if (user.role !== 'supervisor') {
      return res.status(400).json({ success: false, message: 'Only supervisors require approval' });
    }

    user.isApproved = true;
    await user.save();

    res.json({ success: true, message: 'Supervisor accepted', user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a user
// @route   PUT /api/admin/users/:id
// @access  Admin
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).select('-password');

    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a user
// @route   DELETE /api/admin/users/:id
// @access  Admin
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    
    res.json({ success: true, message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all internships
// @route   GET /api/admin/internships
// @access  Admin
exports.getAllInternships = async (req, res) => {
  try {
    const internships = await Internship.find()
      .populate('createdBy', 'name organization email')
      .sort({ createdAt: -1 });
    res.json({ success: true, internships });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all applications
// @route   GET /api/admin/applications
// @access  Admin
exports.getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate('student', 'name email studentId')
      .populate({
        path: 'internship',
        populate: { path: 'createdBy', select: 'name organization' }
      })
      .sort({ createdAt: -1 });
    res.json({ success: true, applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all reports
// @route   GET /api/admin/reports
// @access  Admin
exports.getAllReports = async (req, res) => {
  try {
    const reports = await Report.find()
      .populate('author', 'name role email')
      .populate('internship', 'title company')
      .sort({ createdAt: -1 });
    res.json({ success: true, reports });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};