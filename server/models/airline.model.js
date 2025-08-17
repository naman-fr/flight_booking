const airlineModel = (sequelize, DataTypes) => {
  const Airline = sequelize.define('airline', {
    airId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    airName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    airMobNum: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    airEmail: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    airCity: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    airPinCode: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    airEstDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    airRating: {
      type: DataTypes.DECIMAL(3, 2),
      allowNull: true,
    },
    airStatus: {
      type: DataTypes.ENUM('Active', 'Inactive', 'Deactivation Request', 'Activation Request'),
      defaultValue: 'Active',
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'users',
        key: 'userId',
      },
    },
  });

  return Airline;
};

module.exports = airlineModel; 