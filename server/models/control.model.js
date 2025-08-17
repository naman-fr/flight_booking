const controlModel = (sequelize, DataTypes) => {
  const Control = sequelize.define('control', {
    controlId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    paramName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    paramValue: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });

  return Control;
};

module.exports = controlModel; 