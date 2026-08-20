const express = require('express');
const router = express.Router();
const { getMyFlats, submitPayment, getCustomerPortfolio } = require('../controllers/customerController');
const auth = require('../middleware/authMiddleware');

// Customer portfolio & flat management routes
router.get('/my-flats', auth.requiredAuth, getMyFlats);
router.post('/submit-payment', auth.requiredAuth, submitPayment);
router.get('/portfolio', auth.requiredAuth, getCustomerPortfolio);

module.exports = router;
