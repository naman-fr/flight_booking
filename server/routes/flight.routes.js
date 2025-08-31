const express = require('express');
const router = express.Router();
const flightController = require('../controllers/flight.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Public routes
router.get('/search', flightController.searchFlights);
router.get('/:flightId', flightController.getFlightDetails);

// Admin only routes
router.get('/admin/all', authMiddleware.verifyToken, authMiddleware.isAdmin, flightController.getAllFlights);
router.post('/', authMiddleware.verifyToken, authMiddleware.isAdmin, flightController.createFlight);
router.put('/:flightId', authMiddleware.verifyToken, authMiddleware.isAdmin, flightController.updateFlight);
router.delete('/:flightId', authMiddleware.verifyToken, authMiddleware.isAdmin, flightController.deleteFlight);
router.get('/admin/stats', authMiddleware.verifyToken, authMiddleware.isAdmin, flightController.getFlightStats);

module.exports = router;
