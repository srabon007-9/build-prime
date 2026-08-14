const express = require('express');
const router = express.Router();
const { createConsultation, getConsultations } = require('../controllers/consultationController');
const auth = require('../middleware/authMiddleware');

router.post('/', createConsultation);
router.get('/', auth.requiredAuth, auth.adminOnly, getConsultations);

module.exports = router;
