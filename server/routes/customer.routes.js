const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customer.controller');
const authMiddleware = require('../middleware/auth.middleware');

// All routes require authentication
router.use(authMiddleware.verifyToken);

router.get('/profile', customerController.getProfile);
router.put('/profile', customerController.updateProfile);
router.post('/rating', customerController.submitRating);
router.get('/ratings', customerController.getUserRatings);
router.post('/grievance', customerController.submitGrievance);
router.get('/grievances', customerController.getUserGrievances);
router.get('/flight-history', customerController.getFlightHistory);
router.get('/stats', customerController.getCustomerStats);

module.exports = router;
