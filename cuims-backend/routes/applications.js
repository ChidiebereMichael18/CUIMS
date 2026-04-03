const express = require('express');
const router = express.Router();
const {
  applyForInternship,
  getMyApplications,
  getApplicationsByInternship,
  getMyInterns,
  reviewApplication,
  withdrawApplication,
} = require('../controllers/applicationController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/', protect, authorize('student'), upload.single('resume'), applyForInternship);
router.get('/my', protect, authorize('student'), getMyApplications);
router.get('/my-interns', protect, authorize('supervisor'), getMyInterns);
router.get('/internship/:internshipId', protect, authorize('supervisor', 'admin'), getApplicationsByInternship);
router.put('/:id/review', protect, authorize('supervisor'), reviewApplication);
router.put('/:id/withdraw', protect, authorize('student'), withdrawApplication);

module.exports = router;