const Internship = require('../models/Internship');
const Application = require('../models/Application');

// @desc    Get all open internships (with filters)
// @route   GET /api/internships
// @access  Public
exports.getAllInternships = async (req, res) => {
  try {
    const { status, type, search, page = 1, limit = 10 } = req.query;

    const query = {};
    if (status) query.status = status;
    else query.status = 'open'; // default to open only for public view
    if (type) query.type = type;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { skills: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    const total = await Internship.countDocuments(query);
    const internships = await Internship.find(query)
      .populate('createdBy', 'name organization email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      internships,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single internship
// @route   GET /api/internships/:id
// @access  Public
exports.getInternship = async (req, res) => {
  try {
    const internship = await Internship.findById(req.params.id)
      .populate('createdBy', 'name organization email jobTitle phone')
      .populate('acceptedStudents', 'name email studentId course');

    if (!internship) {
      return res.status(404).json({ success: false, message: 'Internship not found' });
    }

    res.json({ success: true, internship });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create internship
// @route   POST /api/internships
// @access  Supervisor only
exports.createInternship = async (req, res) => {
  try {
    if (!req.user.isApproved) {
      return res.status(403).json({
        success: false,
        message: 'Your account is pending admin approval. You cannot post internships yet.',
      });
    }

    const internship = await Internship.create({
      ...req.body,
      createdBy: req.user.id,
    });

    res.status(201).json({ success: true, internship });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update internship
// @route   PUT /api/internships/:id
// @access  Supervisor (owner) only
exports.updateInternship = async (req, res) => {
  try {
    let internship = await Internship.findById(req.params.id);

    if (!internship) {
      return res.status(404).json({ success: false, message: 'Internship not found' });
    }

    if (internship.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to update this internship' });
    }

    internship = await Internship.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({ success: true, internship });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete internship
// @route   DELETE /api/internships/:id
// @access  Supervisor (owner) or Admin
exports.deleteInternship = async (req, res) => {
  try {
    const internship = await Internship.findById(req.params.id);

    if (!internship) {
      return res.status(404).json({ success: false, message: 'Internship not found' });
    }

    if (internship.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this internship' });
    }

    await internship.deleteOne();
    res.json({ success: true, message: 'Internship deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get internships created by the logged-in supervisor
// @route   GET /api/internships/my
// @access  Supervisor only
exports.getMyInternships = async (req, res) => {
  try {
    const internships = await Internship.find({ createdBy: req.user.id })
      .sort({ createdAt: -1 });

    // Append application count per internship
    const enriched = await Promise.all(
      internships.map(async (i) => {
        const applicationCount = await Application.countDocuments({ internship: i._id });
        const acceptedCount = await Application.countDocuments({ internship: i._id, status: 'accepted' });
        return { ...i.toObject(), applicationCount, acceptedCount };
      })
    );

    res.json({ success: true, internships: enriched });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};