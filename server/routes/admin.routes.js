const express = require('express');
const router = express.Router();
const { authJwt } = require('../middleware');
const adminController = require('../controllers/admin.controller');

// All routes in this file are protected and require Admin role
router.use(authJwt.verifyToken, authJwt.isAdmin);

// Manage Airlines
router.post('/airlines', adminController.createAirline);
router.get('/airlines', adminController.getAllAirlines);
router.get('/airlines/:id', adminController.getAirlineById);
router.put('/airlines/:id', adminController.updateAirline);
router.delete('/airlines/:id', adminController.deleteAirline);

//... other admin routes for users, flights, etc.

module.exports = router; 