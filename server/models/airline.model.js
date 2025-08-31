const airlineModel = (sequelize, DataTypes) => {
  const Airline = sequelize.define('airline', {
    airId: {
      type: DataTypes.STRING(5),
      primaryKey: true,
      allowNull: false,
      references: {
        model: 'users',
        key: 'userId'
      }
    },
    airName: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    airMobNum: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    airEmail: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    airCity: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    airPinCode: {
      type: DataTypes.INTEGER(6),
      allowNull: false,
    },
    airState: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    airAddress: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    airFleet: {
      type: DataTypes.INTEGER(5),
      allowNull: false,
    },
    airEstDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    airRating: {
      type: DataTypes.DECIMAL(1, 2),
      allowNull: true,
    },
    airStatus: {
      type: DataTypes.ENUM('A', 'I', 'R', 'D'),
      defaultValue: 'A',
    },
    airRemark: {
      type: DataTypes.STRING(15),
      allowNull: true,
    },
  });

  return Airline;
};

module.exports = airlineModel;
