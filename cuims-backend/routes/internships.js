const express = require('express');
const router = express.Router();
const {
  getAllInternships,
  getInternship,
  createInternship,
  updateInternship,
  deleteInternship,
  getMyInternships,
} = require('../controllers/InternshipController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getAllInternships);
router.get('/my', protect, authorize('supervisor'), getMyInternships);
router.get('/:id', getInternship);
router.post('/', protect, authorize('supervisor'), createInternship);
router.put('/:id', protect, authorize('supervisor', 'admin'), updateInternship);
router.delete('/:id', protect, authorize('supervisor', 'admin'), deleteInternship);

module.exports = router;