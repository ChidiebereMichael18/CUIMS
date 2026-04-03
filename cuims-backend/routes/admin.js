const express = require('express');
const router = express.Router();
const {
  getStats,
  getAllUsers,
  approveSupervisor,
  updateUser,
  deleteUser,
  getAllInternships,
  getAllApplications,
  getAllReports,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

// All admin routes require authentication + admin role
router.use(protect, authorize('admin'));

router.get('/stats', getStats);
router.get('/users', getAllUsers);
router.put('/users/:id/approve', approveSupervisor);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.get('/internships', getAllInternships);
router.get('/applications', getAllApplications);
router.get('/reports', getAllReports);

module.exports = router;