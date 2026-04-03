const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, studentId, course, yearOfStudy, organization, jobTitle, phone } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    // Only allow student or supervisor self-registration
    if (role === 'admin') {
      return res.status(400).json({ success: false, message: 'Cannot self-register as admin' });
    }

    const user = await User.create({
      name, email, password,
      role: role || 'student',
      studentId, course, yearOfStudy,
      organization, jobTitle, phone,
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: role === 'supervisor'
        ? 'Registration successful. Await admin approval before posting internships.'
        : 'Registration successful.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isApproved: user.isApproved,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    // ── Hardcoded admin bypass (works even without DB) ──
    if (email === 'admin@cavendish.ac.ug' && password === 'Admin@1234') {
      const adminId = 'admin-000000000000';
      const token = generateToken(adminId);
      return res.json({
        success: true,
        token,
        user: {
          id: adminId,
          name: 'System Admin',
          email: 'admin@cavendish.ac.ug',
          role: 'admin',
          isApproved: true,
          organization: 'Cavendish University',
        },
      });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isApproved: user.isApproved,
        organization: user.organization,
        studentId: user.studentId,
        course: user.course,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get logged-in user profile
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update password
// @route   PUT /api/auth/update-password
// @access  Private
exports.updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id).select('+password');

    if (!(await user.comparePassword(currentPassword))) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    const token = generateToken(user._id);
    res.json({ success: true, message: 'Password updated successfully', token });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};