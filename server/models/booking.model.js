const bookingModel = (sequelize, DataTypes) => {
  const Booking = sequelize.define('booking', {
    bkId: {
      type: DataTypes.STRING(5),
      primaryKey: true,
      allowNull: false,
    },
    usrId: {
      type: DataTypes.STRING(5),
      allowNull: false,
      references: {
        model: 'users',
        key: 'userId'
      }
    },
    fltId: {
      type: DataTypes.STRING(5),
      allowNull: false,
      references: {
        model: 'flights',
        key: 'fltId'
      }
    },
    bkDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    bkDepDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    bkStatus: {
      type: DataTypes.ENUM('U', 'C', 'P', 'R', 'W'),
      defaultValue: 'U',
    },
    bkRemark: {
      type: DataTypes.STRING(15),
      allowNull: true,
    },
  });

  return Booking;
};

module.exports = bookingModel;
