const passengerModel = (sequelize, DataTypes) => {
  const Passenger = sequelize.define('passenger', {
    psgId: {
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
    psgName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    psgAge: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    psgGender: {
      type: DataTypes.ENUM('Male', 'Female', 'Other'),
      allowNull: false,
    },
    psgSeatNum: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });

  return Passenger;
};

module.exports = passengerModel; 