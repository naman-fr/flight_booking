const flightModel = (sequelize, DataTypes) => {
  const Flight = sequelize.define('flight', {
    fltId: {
      type: DataTypes.STRING(5),
      primaryKey: true,
      allowNull: false,
    },
    airId: {
      type: DataTypes.STRING(5),
      allowNull: false,
      references: {
        model: 'airlines',
        key: 'airId'
      }
    },
    fltRange: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    fltFuelCap: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    airModel: {
      type: DataTypes.STRING(5),
      allowNull: false,
    },
    fltTotSeat: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    fltOrigin: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    fltDest: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    fltTkPrice: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    fltArrTime: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    fltDepTime: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    fltEndTime: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    fltTotDur: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    fltCabBag: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    fltMainBag: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    fltStatus: {
      type: DataTypes.ENUM('A', 'I'),
      defaultValue: 'A',
    },
    fltRemark: {
      type: DataTypes.STRING(15),
      allowNull: true,
    },
  });

  return Flight;
};

module.exports = flightModel;
