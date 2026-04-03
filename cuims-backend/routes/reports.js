const express = require('express');
const router = express.Router();
const {
  submitReport,
  getReportsByApplication,
  getMyReports,
  updateReport,
  getSupervisorReportsOverview,
} = require('../controllers/reportController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/', protect, authorize('student', 'supervisor'), upload.array('attachments', 5), submitReport);
router.get('/my', protect, authorize('student', 'supervisor'), getMyReports);
router.get('/supervisor-overview', protect, authorize('supervisor'), getSupervisorReportsOverview);
router.get('/application/:applicationId', protect, getReportsByApplication);
router.put('/:id', protect, authorize('student', 'supervisor'), updateReport);

module.exports = router;