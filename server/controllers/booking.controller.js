const db = require('../models');
const Booking = db.Booking;
const Ticket = db.Ticket;
const Passenger = db.Passenger;
const Flight = db.Flight;
const User = db.User;
const { Op } = require('sequelize');

exports.createBooking = async (req, res) => {
  const transaction = await db.sequelize.transaction();

  try {
    const { flightId, passengers, departureDate } = req.body;
    const userId = req.userId;

    // Verify flight exists and is available
    const flight = await Flight.findByPk(flightId, { transaction });
    if (!flight) {
      await transaction.rollback();
      return res.status(404).send({ message: 'Flight not found.' });
    }

    if (flight.fltStatus !== 'A') {
      await transaction.rollback();
      return res.status(400).send({ message: 'Flight is not available for booking.' });
    }

    // Check available seats
    const existingBookings = await Booking.count({
      where: {
        fltId: flightId,
        bkStatus: { [Op.in]: ['U', 'C', 'P'] }
      },
      transaction
    });

    if (existingBookings + passengers.length > flight.fltTotSeat) {
      await transaction.rollback();
      return res.status(400).send({ message: 'Not enough seats available.' });
    }

    // Generate booking ID
    const bookingCount = await Booking.count({ transaction }) + 1;
    const bookingId = `BK${String(bookingCount).padStart(3, '0')}`;

    // Create booking
    const booking = await Booking.create({
      bkId: bookingId,
      usrId: userId,
      fltId: flightId,
      bkDate: new Date(),
      bkDepDate: new Date(departureDate),
      bkStatus: 'U'
    }, { transaction });

    // Create passengers and tickets
    const tickets = [];
    for (let i = 0; i < passengers.length; i++) {
      const passenger = passengers[i];

      // Generate passenger ID
      const passengerCount = await Passenger.count({ transaction }) + 1;
      const passengerId = `PSG${String(passengerCount).padStart(2, '0')}`;

      // Create passenger
      const newPassenger = await Passenger.create({
        psgId: passengerId,
        usrId: userId,
        psgName: passenger.name,
        psgGender: passenger.gender,
        psgAge: passenger.age,
        psgRltn: passenger.relation
      }, { transaction });

      // Generate ticket ID
      const ticketCount = await Ticket.count({ transaction }) + 1;
      const ticketId = `TKT${String(ticketCount).padStart(2, '0')}`;

      // Find available seat number
      const bookedSeats = await Ticket.findAll({
        where: { bkId: bookingId },
        attributes: ['tktSeatNum'],
        transaction
      });
      const bookedSeatNumbers = bookedSeats.map(t => t.tktSeatNum);
      let seatNumber = 1;
      while (bookedSeatNumbers.includes(seatNumber)) {
        seatNumber++;
      }

      // Create ticket
      const ticket = await Ticket.create({
        tktId: ticketId,
        bkId: bookingId,
        psgId: passengerId,
        tktSeatNum: seatNumber,
        tktStatus: 'U'
      }, { transaction });

      tickets.push({
        ...ticket.toJSON(),
        passenger: newPassenger.toJSON()
      });
    }

    await transaction.commit();

    res.status(201).json({
      booking: booking,
      tickets: tickets,
      message: 'Booking created successfully.'
    });
  } catch (error) {
    await transaction.rollback();
    res.status(500).send({ message: error.message });
  }
};

exports.getUserBookings = async (req, res) => {
  try {
    const userId = req.userId;
    const { status, page = 1, limit = 10 } = req.query;

    const whereClause = { usrId: userId };
    if (status) whereClause.bkStatus = status;

    const offset = (page - 1) * limit;

    const bookings = await Booking.findAndCountAll({
      where: whereClause,
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
          model: Ticket,
          as: 'tickets',
          include: [{
            model: Passenger,
            as: 'passenger'
          }]
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['bkDate', 'DESC']]
    });

    res.status(200).json({
      bookings: bookings.rows,
      total: bookings.count,
      page: parseInt(page),
      totalPages: Math.ceil(bookings.count / limit)
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.getBookingDetails = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const userId = req.userId;

    const booking = await Booking.findOne({
      where: { bkId: bookingId, usrId: userId },
      include: [
        {
          model: Flight,
          as: 'flight',
          include: [{
            model: db.Airline,
            as: 'airline'
          }]
        },
        {
          model: Ticket,
          as: 'tickets',
          include: [{
            model: Passenger,
            as: 'passenger'
          }]
        }
      ]
    });

    if (!booking) {
      return res.status(404).send({ message: 'Booking not found.' });
    }

    res.status(200).json(booking);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.cancelBooking = async (req, res) => {
  const transaction = await db.sequelize.transaction();

  try {
    const { bookingId } = req.params;
    const userId = req.userId;

    const booking = await Booking.findOne({
      where: { bkId: bookingId, usrId: userId },
      transaction
    });

    if (!booking) {
      await transaction.rollback();
      return res.status(404).send({ message: 'Booking not found.' });
    }

    if (booking.bkStatus === 'C') {
      await transaction.rollback();
      return res.status(400).send({ message: 'Booking is already cancelled.' });
    }

    // Update booking status
    await booking.update({ bkStatus: 'C' }, { transaction });

    // Update all associated tickets
    await Ticket.update(
      { tktStatus: 'C' },
      { where: { bkId: bookingId }, transaction }
    );

    await transaction.commit();
    res.status(200).send({ message: 'Booking cancelled successfully.' });
  } catch (error) {
    await transaction.rollback();
    res.status(500).send({ message: error.message });
  }
};

exports.getAllBookings = async (req, res) => {
  try {
    const { status, flight, user, page = 1, limit = 10 } = req.query;

    const whereClause = {};
    if (status) whereClause.bkStatus = status;
    if (flight) whereClause.fltId = flight;
    if (user) whereClause.usrId = user;

    const offset = (page - 1) * limit;

    const bookings = await Booking.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['userId', 'userRole']
        },
        {
          model: Flight,
          as: 'flight',
          include: [{
            model: db.Airline,
            as: 'airline',
            attributes: ['airName']
          }]
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['bkDate', 'DESC']]
    });

    res.status(200).json({
      bookings: bookings.rows,
      total: bookings.count,
      page: parseInt(page),
      totalPages: Math.ceil(bookings.count / limit)
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.updateBookingStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status, remark } = req.body;

    const booking = await Booking.findByPk(bookingId);
    if (!booking) {
      return res.status(404).send({ message: 'Booking not found.' });
    }

    const updateData = { bkStatus: status };
    if (remark) updateData.bkRemark = remark;

    await booking.update(updateData);

    // Update associated tickets
    await Ticket.update(
      { tktStatus: status },
      { where: { bkId: bookingId } }
    );

    res.status(200).send({ message: 'Booking status updated successfully.' });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.getBookingStats = async (req, res) => {
  try {
    const totalBookings = await Booking.count();
    const pendingBookings = await Booking.count({ where: { bkStatus: 'U' } });
    const confirmedBookings = await Booking.count({ where: { bkStatus: 'C' } });
    const cancelledBookings = await Booking.count({ where: { bkStatus: 'R' } });

    // Get revenue by flight
    const revenueByFlight = await Booking.findAll({
      attributes: [
        'fltId',
        [db.sequelize.fn('COUNT', db.sequelize.col('bkId')), 'bookingCount'],
        [db.sequelize.fn('SUM',
          db.sequelize.literal('(SELECT fltTkPrice FROM flights WHERE flights.fltId = bookings.fltId)')
        ), 'revenue']
      ],
      where: { bkStatus: { [Op.in]: ['C', 'P'] } },
      group: ['fltId'],
      order: [[db.sequelize.literal('revenue'), 'DESC']]
    });

    res.status(200).json({
      total: totalBookings,
      pending: pendingBookings,
      confirmed: confirmedBookings,
      cancelled: cancelledBookings,
      revenueByFlight: revenueByFlight
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
