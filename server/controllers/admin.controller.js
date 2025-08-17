const db = require('../models');
const User = db.User;
const Airline = db.Airline;
const bcrypt = require('bcryptjs');

// Create a new Airline
exports.createAirline = async (req, res) => {
  try {
    // Create a user entry for the airline first for login purposes
    const user = await User.create({
      userId: req.body.airId, // As per schema, using airId for userId
      password: bcrypt.hashSync(req.body.password, 8),
      userRole: 'Airline',
      status: 'Active',
    });

    // Then create the airline profile
    const airline = await Airline.create({
      airId: req.body.airId,
      airName: req.body.airName,
      airMobNum: req.body.airMobNum,
      airEmail: req.body.airEmail,
      airCity: req.body.airCity,
      //... other fields
      airStatus: 'Active',
      userId: user.userId // Link to the created user entry, assuming userId in User model is the PK
    });

    res.status(201).send({ message: 'Airline registered successfully!', data: airline });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Get all airlines
exports.getAllAirlines = async (req, res) => {
    try {
        const airlines = await Airline.findAll();
        res.status(200).send(airlines);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

// Get airline by ID
exports.getAirlineById = async (req, res) => {
  try {
    const airline = await Airline.findByPk(req.params.id);
    if (!airline) {
      return res.status(404).send({ message: 'Airline not found.' });
    }
    res.status(200).send(airline);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Update Airline
exports.updateAirline = async (req, res) => {
  try {
    const [updated] = await Airline.update(req.body, {
      where: { airId: req.params.id }
    });
    if (updated) {
      const updatedAirline = await Airline.findByPk(req.params.id);
      res.status(200).send({ message: 'Airline updated successfully!', data: updatedAirline });
    } else {
      res.status(404).send({ message: 'Airline not found.' });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Delete Airline
exports.deleteAirline = async (req, res) => {
  try {
    const deleted = await Airline.destroy({
      where: { airId: req.params.id }
    });
    if (deleted) {
      res.status(200).send({ message: 'Airline deleted successfully!' });
    } else {
      res.status(404).send({ message: 'Airline not found.' });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
}; 