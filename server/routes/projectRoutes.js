const express = require('express');
const router = express.Router();
const {
  getProjects,
  getProjectById,
  getStatsOverview,
  createProject,
  updateProject,
  deleteProject,
  addTransaction,
  bookUnit,
  recordFlatPayment,
  verifyFlatPayment,
  updateUnitStatus
} = require('../controllers/projectController');
const auth = require('../middleware/authMiddleware');

router.get('/', getProjects);
router.get('/stats/overview', auth.requiredAuth, auth.adminOnly, getStatsOverview);
router.post('/', auth.requiredAuth, auth.adminOnly, createProject);
router.put('/:id', auth.requiredAuth, auth.adminOnly, updateProject);
router.delete('/:id', auth.requiredAuth, auth.adminOnly, deleteProject);
router.post('/:id/transactions', auth.requiredAuth, auth.adminOnly, addTransaction);

// Flat booking & payment routes (admin only)
router.post('/:id/book-unit', auth.requiredAuth, auth.adminOnly, bookUnit);
router.post('/:id/record-flat-payment', auth.requiredAuth, auth.adminOnly, recordFlatPayment);
router.put('/:id/payments/:paymentId/verify', auth.requiredAuth, auth.adminOnly, verifyFlatPayment);
router.put('/:id/units/:unitId/status', auth.requiredAuth, auth.adminOnly, updateUnitStatus);

router.get('/:id', getProjectById);

module.exports = router;
