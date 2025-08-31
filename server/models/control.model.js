const controlModel = (sequelize, DataTypes) => {
  const Control = sequelize.define('control', {
    keyField1: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    keyField2: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    value: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(15),
      allowNull: false,
    },
  }, {
    indexes: [
      {
        unique: true,
        fields: ['keyField1', 'keyField2', 'value'],
      },
    ],
  });

  return Control;
};

module.exports = controlModel;
