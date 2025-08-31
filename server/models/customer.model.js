const customerModel = (sequelize, DataTypes) => {
  const Customer = sequelize.define('customer', {
    usrId: {
      type: DataTypes.STRING(5),
      primaryKey: true,
      allowNull: false,
      references: {
        model: 'users',
        key: 'userId'
      }
    },
    usrName: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    usrDOB: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    usrGender: {
      type: DataTypes.ENUM('M', 'F', 'O'),
      allowNull: false,
    },
    usrMobNum: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    usrEmail: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    usrCity: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    usrPinCode: {
      type: DataTypes.INTEGER(6),
      allowNull: false,
    },
    usrState: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    usrAddress: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    usrAadhar: {
      type: DataTypes.STRING(12),
      allowNull: false,
    },
    usrStatus: {
      type: DataTypes.ENUM('A', 'I'),
      defaultValue: 'A',
    },
    usrRemark: {
      type: DataTypes.STRING(15),
      allowNull: true,
    },
  });

  return Customer;
};

module.exports = customerModel;
