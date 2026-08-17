const express = require('express');
const router = express.Router();
const {
  getProjects,
  getProjectById,
  getStatsOverview,
  createProject,
  updateProject,
  deleteProject,
  addTransaction
} = require('../controllers/projectController');
const auth = require('../middleware/authMiddleware');

router.get('/', getProjects);
router.get('/stats/overview', auth.requiredAuth, auth.adminOnly, getStatsOverview);
router.post('/', auth.requiredAuth, auth.adminOnly, createProject);
router.put('/:id', auth.requiredAuth, auth.adminOnly, updateProject);
router.delete('/:id', auth.requiredAuth, auth.adminOnly, deleteProject);
router.post('/:id/transactions', auth.requiredAuth, auth.adminOnly, addTransaction);
router.get('/:id', getProjectById);

module.exports = router;
