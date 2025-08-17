const customerModel = (sequelize, DataTypes) => {
  const Customer = sequelize.define('customer', {
    custId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    custName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    custMobNum: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    custEmail: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    custCity: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    usrAadhar: {
      type: DataTypes.STRING,
      allowNull: true,
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

  return Customer;
};

module.exports = customerModel; 