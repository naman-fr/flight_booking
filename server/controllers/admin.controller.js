const db = require('../models');
const User = db.User;
const Airline = db.Airline;
const Customer = db.Customer;
const Flight = db.Flight;
const Booking = db.Booking;
const Grievance = db.Grievance;
const Rating = db.Rating;
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');

// User Management
exports.getAllUsers = async (req, res) => {
  try {
    const { role, status, page = 1, limit = 10 } = req.query;

    const whereClause = {};
    if (role) whereClause.userRole = role;
    if (status) whereClause.status = status;

    const offset = (page - 1) * limit;

    const users = await User.findAndCountAll({
      where: whereClause,
      attributes: { exclude: ['password'] },
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      users: users.rows,
      total: users.count,
      page: parseInt(page),
      totalPages: Math.ceil(users.count / limit)
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.updateUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { status, remark } = req.body;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).send({ message: 'User not found.' });
    }

    const updateData = { status };
    if (remark) updateData.remark = remark;

    await user.update(updateData);
    res.status(200).send({ message: 'User status updated successfully.' });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).send({ message: 'User not found.' });
    }

    // Check for active bookings if customer
    if (user.userRole === 'Customer') {
      const activeBookings = await Booking.count({
        where: {
          usrId: userId,
          bkStatus: { [Op.in]: ['U', 'C', 'P'] }
        }
      });

      if (activeBookings > 0) {
        return res.status(400).send({
          message: 'Cannot delete user with active bookings.'
        });
      }
    }

    await user.destroy();
    res.status(200).send({ message: 'User deleted successfully.' });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Airline Management
exports.createAirline = async (req, res) => {
  try {
    const {
      airId,
      password,
      airName,
      airMobNum,
      airEmail,
      airCity,
      airPinCode,
      airState,
      airAddress,
      airFleet,
      airEstDate
    } = req.body;

    // Check if airline ID already exists
    const existingUser = await User.findByPk(airId);
    if (existingUser) {
      return res.status(400).send({ message: 'Airline ID already exists.' });
    }

    // Hash password
    const hashedPassword = bcrypt.hashSync(password, 8);

    // Create user account
    await User.create({
      userId: airId,
      password: hashedPassword,
      userRole: 'Airline',
      status: 'A'
    });

    // Create airline profile
    const airline = await Airline.create({
      airId,
      airName,
      airMobNum,
      airEmail,
      airCity,
      airPinCode: parseInt(airPinCode),
      airState,
      airAddress,
      airFleet: parseInt(airFleet),
      airEstDate: new Date(airEstDate),
      airStatus: 'A'
    });

    res.status(201).json({
      airline,
      message: 'Airline created successfully.'
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.getAllAirlines = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    const whereClause = {};
    if (status) whereClause.airStatus = status;

    const offset = (page - 1) * limit;

    const airlines = await Airline.findAndCountAll({
      where: whereClause,
      include: [{
        model: User,
        as: 'user',
        attributes: ['status', 'lastLogin']
      }],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      airlines: airlines.rows,
      total: airlines.count,
      page: parseInt(page),
      totalPages: Math.ceil(airlines.count / limit)
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.updateAirline = async (req, res) => {
  try {
    const { airId } = req.params;
    const updateData = req.body;

    const airline = await Airline.findByPk(airId);
    if (!airline) {
      return res.status(404).send({ message: 'Airline not found.' });
    }

    // Remove fields that shouldn't be updated directly
    delete updateData.airId;

    await airline.update(updateData);
    res.status(200).json(airline);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.deleteAirline = async (req, res) => {
  try {
    const { airId } = req.params;

    const airline = await Airline.findByPk(airId);
    if (!airline) {
      return res.status(404).send({ message: 'Airline not found.' });
    }

    // Check for active flights
    const activeFlights = await Flight.count({
      where: {
        airId: airId,
        fltStatus: 'A'
      }
    });

    if (activeFlights > 0) {
      return res.status(400).send({
        message: 'Cannot delete airline with active flights.'
      });
    }

    // Delete associated user account
    await User.destroy({ where: { userId: airId } });
    await airline.destroy();

    res.status(200).send({ message: 'Airline deleted successfully.' });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Customer Management
exports.getAllCustomers = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    const whereClause = {};
    if (status) whereClause.usrStatus = status;

    const offset = (page - 1) * limit;

    const customers = await Customer.findAndCountAll({
      where: whereClause,
      include: [{
        model: User,
        as: 'user',
        attributes: ['status', 'lastLogin']
      }],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      customers: customers.rows,
      total: customers.count,
      page: parseInt(page),
      totalPages: Math.ceil(customers.count / limit)
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.updateCustomer = async (req, res) => {
  try {
    const { usrId } = req.params;
    const updateData = req.body;

    const customer = await Customer.findByPk(usrId);
    if (!customer) {
      return res.status(404).send({ message: 'Customer not found.' });
    }

    // Remove sensitive fields
    delete updateData.usrId;
    delete updateData.usrAadhar;

    await customer.update(updateData);
    res.status(200).json(customer);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Grievance Management
exports.getAllGrievances = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    const whereClause = {};
    if (status) whereClause.status = status;

    const offset = (page - 1) * limit;

    const grievances = await Grievance.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['userId']
        },
        {
          model: Flight,
          as: 'flight',
          include: [{
            model: Airline,
            as: 'airline',
            attributes: ['airName']
          }]
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      grievances: grievances.rows,
      total: grievances.count,
      page: parseInt(page),
      totalPages: Math.ceil(grievances.count / limit)
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.respondToGrievance = async (req, res) => {
  try {
    const { grvId } = req.params;
    const { response } = req.body;

    const grievance = await Grievance.findByPk(grvId);
    if (!grievance) {
      return res.status(404).send({ message: 'Grievance not found.' });
    }

    await grievance.update({
      response,
      status: 'R'
    });

    res.status(200).send({ message: 'Response submitted successfully.' });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Reports and Analytics
exports.getSystemStats = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const totalCustomers = await User.count({ where: { userRole: 'Customer' } });
    const totalAirlines = await User.count({ where: { userRole: 'Airline' } });
    const totalFlights = await Flight.count();
    const totalBookings = await Booking.count();
    const totalRevenue = await Booking.sum('flight.fltTkPrice', {
      include: [{
        model: Flight,
        as: 'flight'
      }],
      where: { bkStatus: { [Op.in]: ['C', 'P'] } }
    });

    const pendingGrievances = await Grievance.count({ where: { status: 'P' } });
    const averageRating = await Rating.findAll({
      attributes: [
        [db.sequelize.fn('AVG', db.sequelize.col('rating')), 'avgRating']
      ]
    });

    res.status(200).json({
      users: {
        total: totalUsers,
        customers: totalCustomers,
        airlines: totalAirlines
      },
      flights: totalFlights,
      bookings: totalBookings,
      revenue: totalRevenue || 0,
      pendingGrievances: pendingGrievances,
      averageRating: averageRating[0]?.dataValues?.avgRating || 0
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.getRevenueReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const whereClause = {
      bkStatus: { [Op.in]: ['C', 'P'] }
    };

    if (startDate && endDate) {
      whereClause.bkDate = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }

    const revenue = await Booking.findAll({
      where: whereClause,
      attributes: [
        [db.sequelize.fn('DATE', db.sequelize.col('bkDate')), 'date'],
        [db.sequelize.fn('COUNT', db.sequelize.col('bkId')), 'bookings'],
        [db.sequelize.fn('SUM',
          db.sequelize.literal('(SELECT fltTkPrice FROM flights WHERE flights.fltId = bookings.fltId)')
        ), 'revenue']
      ],
      include: [{
        model: Flight,
        as: 'flight',
        attributes: []
      }],
      group: [db.sequelize.fn('DATE', db.sequelize.col('bkDate'))],
      order: [[db.sequelize.fn('DATE', db.sequelize.col('bkDate')), 'DESC']]
    });

    res.status(200).json(revenue);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.getPopularRoutes = async (req, res) => {
  try {
    const popularRoutes = await Flight.findAll({
      attributes: [
        'fltOrigin',
        'fltDest',
        [db.sequelize.fn('COUNT',
          db.sequelize.literal('(SELECT bkId FROM bookings WHERE bookings.fltId = flights.fltId AND bkStatus IN ("C", "P"))')
        ), 'bookingCount']
      ],
      include: [{
        model: Booking,
        as: 'bookings',
        where: { bkStatus: { [Op.in]: ['C', 'P'] } },
        required: true,
        attributes: []
      }],
      group: ['fltOrigin', 'fltDest'],
      order: [[db.sequelize.literal('bookingCount'), 'DESC']],
      limit: 10
    });

    res.status(200).json(popularRoutes);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
