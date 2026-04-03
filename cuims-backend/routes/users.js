const express = require('express');
const router = express.Router();
const { updateProfile, getUserProfile } = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.put('/profile', protect, upload.single('profilePhoto'), updateProfile);
router.get('/:id', protect, getUserProfile);

module.exports = router;