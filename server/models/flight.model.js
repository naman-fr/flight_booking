const flightModel = (sequelize, DataTypes) => {
  const Flight = sequelize.define('flight', {
    fltId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    airId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'airlines',
        key: 'airId',
      },
    },
    fltNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    fltOrigin: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fltDestination: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fltDepDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    fltDepTime: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    fltArrDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    fltArrTime: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    fltDuration: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    fltCapacity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    fltTkPrice: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    fltStatus: {
      type: DataTypes.ENUM('Scheduled', 'Delayed', 'Cancelled', 'Active', 'Completed'),
      defaultValue: 'Scheduled',
    },
  });

  return Flight;
};

module.exports = flightModel; 