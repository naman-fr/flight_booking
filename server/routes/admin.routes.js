const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const authMiddleware = require('../middleware/auth.middleware');

// All routes in this file are protected and require Admin role
router.use(authMiddleware.verifyToken, authMiddleware.isAdmin);

// User Management
router.get('/users', adminController.getAllUsers);
router.put('/users/:userId/status', adminController.updateUserStatus);
router.delete('/users/:userId', adminController.deleteUser);

// Airline Management
router.post('/airlines', adminController.createAirline);
router.get('/airlines', adminController.getAllAirlines);
router.put('/airlines/:airId', adminController.updateAirline);
router.delete('/airlines/:airId', adminController.deleteAirline);

// Customer Management
router.get('/customers', adminController.getAllCustomers);
router.put('/customers/:usrId', adminController.updateCustomer);

// Grievance Management
router.get('/grievances', adminController.getAllGrievances);
router.put('/grievances/:grvId/respond', adminController.respondToGrievance);

// Reports and Analytics
router.get('/stats', adminController.getSystemStats);
router.get('/reports/revenue', adminController.getRevenueReport);
router.get('/reports/popular-routes', adminController.getPopularRoutes);

module.exports = router;
