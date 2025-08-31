const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/booking.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Protected routes for authenticated users
router.use(authMiddleware.verifyToken);

router.post('/', bookingController.createBooking);
router.get('/user', bookingController.getUserBookings);
router.get('/:bookingId', bookingController.getBookingDetails);
router.put('/:bookingId/cancel', bookingController.cancelBooking);

// Admin routes
router.get('/admin/all', authMiddleware.isAdmin, bookingController.getAllBookings);
router.put('/admin/:bookingId/status', authMiddleware.isAdmin, bookingController.updateBookingStatus);
router.get('/admin/stats', authMiddleware.isAdmin, bookingController.getBookingStats);

module.exports = router;
