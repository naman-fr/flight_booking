const db = require('../models');
const Customer = db.Customer;
const Rating = db.Rating;
const Grievance = db.Grievance;
const Flight = db.Flight;
const Booking = db.Booking;

exports.getProfile = async (req, res) => {
  try {
    const userId = req.userId;

    const customer = await Customer.findByPk(userId, {
      include: [{
        model: db.User,
        as: 'user',
        attributes: ['userId', 'userRole', 'lastLogin']
      }]
    });

    if (!customer) {
      return res.status(404).send({ message: 'Customer profile not found.' });
    }

    res.status(200).json(customer);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const updateData = req.body;

    const customer = await Customer.findByPk(userId);
    if (!customer) {
      return res.status(404).send({ message: 'Customer profile not found.' });
    }

    // Remove sensitive fields that shouldn't be updated directly
    delete updateData.usrId;
    delete updateData.usrAadhar; // Aadhar should not be changeable

    await customer.update(updateData);
    res.status(200).json(customer);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.submitRating = async (req, res) => {
  try {
    const userId = req.userId;
    const { flightId, rating, feedback } = req.body;

    // Validate rating
    if (rating < 1 || rating > 5) {
      return res.status(400).send({ message: 'Rating must be between 1 and 5.' });
    }

    // Check if user has booked this flight
    const booking = await Booking.findOne({
      where: {
        usrId: userId,
        fltId: flightId,
        bkStatus: { [db.Sequelize.Op.in]: ['C', 'P'] }
      }
    });

    if (!booking) {
      return res.status(400).send({
        message: 'You can only rate flights you have booked and completed.'
      });
    }

    // Check if rating already exists
    const existingRating = await Rating.findOne({
      where: { usrId: userId, fltId: flightId }
    });

    if (existingRating) {
      // Update existing rating
      await existingRating.update({ rating, feedback });
      res.status(200).send({ message: 'Rating updated successfully.' });
    } else {
      // Create new rating
      await Rating.create({
        usrId: userId,
        fltId: flightId,
        rating,
        feedback
      });
      res.status(201).send({ message: 'Rating submitted successfully.' });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.getUserRatings = async (req, res) => {
  try {
    const userId = req.userId;

    const ratings = await Rating.findAll({
      where: { usrId: userId },
      include: [{
        model: Flight,
        as: 'flight',
        include: [{
          model: db.Airline,
          as: 'airline',
          attributes: ['airName']
        }]
      }],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json(ratings);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.submitGrievance = async (req, res) => {
  try {
    const userId = req.userId;
    const { flightId, complaint } = req.body;

    // Generate grievance ID
    const grievanceCount = await Grievance.count() + 1;
    const grievanceId = `GRV${String(grievanceCount).padStart(2, '0')}`;

    const grievance = await Grievance.create({
      grvId: grievanceId,
      usrId: userId,
      fltId: flightId,
      complaint,
      status: 'P'
    });

    res.status(201).json({
      grievance,
      message: 'Grievance submitted successfully.'
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.getUserGrievances = async (req, res) => {
  try {
    const userId = req.userId;

    const grievances = await Grievance.findAll({
      where: { usrId: userId },
      include: [{
        model: Flight,
        as: 'flight',
        include: [{
          model: db.Airline,
          as: 'airline',
          attributes: ['airName']
        }]
      }],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json(grievances);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.getFlightHistory = async (req, res) => {
  try {
    const userId = req.userId;

    const bookings = await Booking.findAll({
      where: {
        usrId: userId,
        bkStatus: { [db.Sequelize.Op.in]: ['C', 'P'] }
      },
      include: [
        {
          model: Flight,
          as: 'flight',
          include: [{
            model: db.Airline,
            as: 'airline',
            attributes: ['airName']
          }]
        },
        {
          model: Rating,
          as: 'rating',
          required: false,
          where: { usrId: userId }
        }
      ],
      order: [['bkDepDate', 'DESC']]
    });

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.getCustomerStats = async (req, res) => {
  try {
    const userId = req.userId;

    const totalBookings = await Booking.count({ where: { usrId: userId } });
    const completedBookings = await Booking.count({
      where: {
        usrId: userId,
        bkStatus: { [db.Sequelize.Op.in]: ['C', 'P'] }
      }
    });
    const totalRatings = await Rating.count({ where: { usrId: userId } });
    const totalGrievances = await Grievance.count({ where: { usrId: userId } });

    // Get favorite airlines based on bookings
    const favoriteAirlines = await Booking.findAll({
      where: { usrId: userId },
      attributes: [
        [db.sequelize.fn('COUNT', db.sequelize.col('bkId')), 'bookingCount']
      ],
      include: [{
        model: Flight,
        as: 'flight',
        include: [{
          model: db.Airline,
          as: 'airline',
          attributes: ['airName']
        }]
      }],
      group: ['flight.airId', 'flight.airline.airId', 'flight.airline.airName'],
      order: [[db.sequelize.literal('bookingCount'), 'DESC']],
      limit: 5
    });

    res.status(200).json({
      totalBookings,
      completedBookings,
      totalRatings,
      totalGrievances,
      favoriteAirlines
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
