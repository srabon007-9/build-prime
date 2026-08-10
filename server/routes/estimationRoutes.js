const express = require('express');
const router = express.Router();
const { calculateAndSave, getMyEstimates } = require('../controllers/estimationController');
const auth = require('../middleware/authMiddleware');

router.post('/', auth.optionalAuth, calculateAndSave);
router.get('/my', auth.requiredAuth, getMyEstimates);

module.exports = router;
