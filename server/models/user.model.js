const userModel = (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
    userId: {
      type: DataTypes.STRING(5),
      primaryKey: true,
      allowNull: false,
    },
    userPass: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    userRole: {
      type: DataTypes.ENUM('Admin', 'Airline', 'Customer'),
      allowNull: false,
    },
    lastLogin: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    userQstn: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },
    userAnswr: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('A', 'I', 'R', 'D'),
      defaultValue: 'A',
    },
    remark: {
      type: DataTypes.STRING(15),
      allowNull: true,
    },
  });

  return User;
};

module.exports = userModel;
