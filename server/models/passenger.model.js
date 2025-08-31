const passengerModel = (sequelize, DataTypes) => {
  const Passenger = sequelize.define('passenger', {
    psgId: {
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
    psgName: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    psgGender: {
      type: DataTypes.ENUM('M', 'F', 'O'),
      allowNull: false,
    },
    psgAge: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    psgRltn: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
  });

  return Passenger;
};

module.exports = passengerModel;
