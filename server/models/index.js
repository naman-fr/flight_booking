const { Sequelize, DataTypes } = require('sequelize');
const dbConfig = require('../config/database');

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.DIALECT,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import models
db.User = require('./user.model')(sequelize, DataTypes);
db.Airline = require('./airline.model')(sequelize, DataTypes);
db.Customer = require('./customer.model')(sequelize, DataTypes);
db.Flight = require('./flight.model')(sequelize, DataTypes);
db.Booking = require('./booking.model')(sequelize, DataTypes);
db.Passenger = require('./passenger.model')(sequelize, DataTypes);
db.Ticket = require('./ticket.model')(sequelize, DataTypes);
db.Rating = require('./rating.model')(sequelize, DataTypes);
db.Grievance = require('./grievance.model')(sequelize, DataTypes);
db.Control = require('./control.model')(sequelize, DataTypes);

// Define Associations

// User has one Customer profile
db.User.hasOne(db.Customer, { foreignKey: 'userId', as: 'profile' });
db.Customer.belongsTo(db.User, { foreignKey: 'userId' });

// User has one Airline profile
db.User.hasOne(db.Airline, { foreignKey: 'userId', as: 'airlineProfile' });
db.Airline.belongsTo(db.User, { foreignKey: 'userId' });

// User (Customer) has many Bookings
db.User.hasMany(db.Booking, { foreignKey: 'userId' });
db.Booking.belongsTo(db.User, { foreignKey: 'userId' });

// User (Customer) has many Passengers
db.User.hasMany(db.Passenger, { foreignKey: 'userId' });
db.Passenger.belongsTo(db.User, { foreignKey: 'userId' });

// Airline has many Flights
db.Airline.hasMany(db.Flight, { foreignKey: 'airId' });
db.Flight.belongsTo(db.Airline, { foreignKey: 'airId' });

// Flight is part of many Bookings
db.Flight.hasMany(db.Booking, { foreignKey: 'fltId' });
db.Booking.belongsTo(db.Flight, { foreignKey: 'fltId' });

// Booking has many Tickets
db.Booking.hasMany(db.Ticket, { foreignKey: 'bkId' });
db.Ticket.belongsTo(db.Booking, { foreignKey: 'bkId' });

// Ticket is for one Passenger
db.Passenger.hasMany(db.Ticket, { foreignKey: 'psgId' });
db.Ticket.belongsTo(db.Passenger, { foreignKey: 'psgId' });

// User (Customer) can rate many Flights (creates a join table)
db.User.belongsToMany(db.Flight, { through: db.Rating, foreignKey: 'userId' });
db.Flight.belongsToMany(db.User, { through: db.Rating, foreignKey: 'fltId' });

// User (Customer) can file many Grievances against Flights
db.User.hasMany(db.Grievance, { foreignKey: 'userId' });
db.Grievance.belongsTo(db.User, { foreignKey: 'userId' });
db.Flight.hasMany(db.Grievance, { foreignKey: 'fltId' });
db.Grievance.belongsTo(db.Flight, { foreignKey: 'fltId' });

module.exports = db; 