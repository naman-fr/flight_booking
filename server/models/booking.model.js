const bookingModel = (sequelize, DataTypes) => {
  const Booking = sequelize.define('booking', {
    bkId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'users',
        key: 'userId',
      },
    },
    fltId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'flights',
        key: 'fltId',
      },
    },
    bkDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    bkNumPassengers: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    bkTotalPrice: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    bkStatus: {
      type: DataTypes.ENUM('Upcoming', 'Completed', 'Cancelled', 'Cancellation Request', 'Cancelled with Refund'),
      defaultValue: 'Upcoming',
    },
  });

  return Booking;
};

module.exports = bookingModel; 