const db = require('../models');
const Flight = db.Flight;
const Airline = db.Airline;
const Booking = db.Booking;
const { Op } = require('sequelize');

exports.searchFlights = async (req, res) => {
  try {
    const { origin, destination, departureDate, returnDate, passengers } = req.query;

    const whereClause = {
      fltOrigin: origin,
      fltDest: destination,
      fltStatus: 'A'
    };

    // Add date filter if provided
    if (departureDate) {
      whereClause.fltDepTime = {
        [Op.gte]: new Date(departureDate + ' 00:00:00'),
        [Op.lt]: new Date(departureDate + ' 23:59:59')
      };
    }

    const flights = await Flight.findAll({
      where: whereClause,
      include: [{
        model: Airline,
        as: 'airline',
        attributes: ['airName', 'airRating']
      }],
      order: [['fltDepTime', 'ASC']]
    });

    // Get available seats for each flight
    const flightsWithAvailability = await Promise.all(
      flights.map(async (flight) => {
        const bookedSeats = await Booking.count({
          where: {
            fltId: flight.fltId,
            bkStatus: { [Op.in]: ['U', 'C', 'P'] }
          }
        });

        return {
          ...flight.toJSON(),
          availableSeats: flight.fltTotSeat - bookedSeats
        };
      })
    );

    res.status(200).json(flightsWithAvailability);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.getFlightDetails = async (req, res) => {
  try {
    const { flightId } = req.params;

    const flight = await Flight.findByPk(flightId, {
      include: [{
        model: Airline,
        as: 'airline',
        attributes: ['airName', 'airMobNum', 'airEmail', 'airRating']
      }]
    });

    if (!flight) {
      return res.status(404).send({ message: 'Flight not found.' });
    }

    // Get seat availability
    const bookedSeats = await Booking.count({
      where: {
        fltId: flightId,
        bkStatus: { [Op.in]: ['U', 'C', 'P'] }
      }
    });

    const flightData = {
      ...flight.toJSON(),
      availableSeats: flight.fltTotSeat - bookedSeats,
      bookedSeats: bookedSeats
    };

    res.status(200).json(flightData);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.getAllFlights = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, airline } = req.query;

    const whereClause = {};
    if (status) whereClause.fltStatus = status;
    if (airline) whereClause.airId = airline;

    const offset = (page - 1) * limit;

    const flights = await Flight.findAndCountAll({
      where: whereClause,
      include: [{
        model: Airline,
        as: 'airline',
        attributes: ['airName']
      }],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      flights: flights.rows,
      total: flights.count,
      page: parseInt(page),
      totalPages: Math.ceil(flights.count / limit)
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.createFlight = async (req, res) => {
  try {
    const flightData = req.body;

    // Validate required fields
    const requiredFields = ['fltId', 'airId', 'fltRange', 'fltFuelCap', 'airModel',
                           'fltTotSeat', 'fltOrigin', 'fltDest', 'fltTkPrice',
                           'fltArrTime', 'fltDepTime', 'fltEndTime', 'fltTotDur',
                           'fltCabBag', 'fltMainBag'];

    for (const field of requiredFields) {
      if (!flightData[field]) {
        return res.status(400).send({ message: `${field} is required.` });
      }
    }

    // Check if flight ID already exists
    const existingFlight = await Flight.findByPk(flightData.fltId);
    if (existingFlight) {
      return res.status(400).send({ message: 'Flight ID already exists.' });
    }

    // Verify airline exists
    const airline = await Airline.findByPk(flightData.airId);
    if (!airline) {
      return res.status(404).send({ message: 'Airline not found.' });
    }

    const flight = await Flight.create(flightData);
    res.status(201).json(flight);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.updateFlight = async (req, res) => {
  try {
    const { flightId } = req.params;
    const updateData = req.body;

    const flight = await Flight.findByPk(flightId);
    if (!flight) {
      return res.status(404).send({ message: 'Flight not found.' });
    }

    await flight.update(updateData);
    res.status(200).json(flight);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.deleteFlight = async (req, res) => {
  try {
    const { flightId } = req.params;

    const flight = await Flight.findByPk(flightId);
    if (!flight) {
      return res.status(404).send({ message: 'Flight not found.' });
    }

    // Check if flight has active bookings
    const activeBookings = await Booking.count({
      where: {
        fltId: flightId,
        bkStatus: { [Op.in]: ['U', 'C', 'P'] }
      }
    });

    if (activeBookings > 0) {
      return res.status(400).send({
        message: 'Cannot delete flight with active bookings.'
      });
    }

    await flight.destroy();
    res.status(200).send({ message: 'Flight deleted successfully.' });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.getFlightStats = async (req, res) => {
  try {
    const totalFlights = await Flight.count();
    const activeFlights = await Flight.count({ where: { fltStatus: 'A' } });
    const inactiveFlights = await Flight.count({ where: { fltStatus: 'I' } });

    // Get flights by airline
    const flightsByAirline = await Flight.findAll({
      attributes: [
        'airId',
        [db.sequelize.fn('COUNT', db.sequelize.col('fltId')), 'count']
      ],
      include: [{
        model: Airline,
        as: 'airline',
        attributes: ['airName']
      }],
      group: ['airId', 'airline.airId', 'airline.airName']
    });

    res.status(200).json({
      total: totalFlights,
      active: activeFlights,
      inactive: inactiveFlights,
      byAirline: flightsByAirline
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
