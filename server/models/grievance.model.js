const grievanceModel = (sequelize, DataTypes) => {
  const Grievance = sequelize.define('grievance', {
    grvId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'users',
        key: 'userId',
      },
    },
    fltId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'flights',
        key: 'fltId',
      },
    },
    grvSubject: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    grvDescription: {
      type: DataTypes.STRING(1000),
      allowNull: false,
    },
    grvDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    grvStatus: {
      type: DataTypes.ENUM('Pending', 'Resolved', 'Rejected'),
      defaultValue: 'Pending',
    },
  });

  return Grievance;
};

module.exports = grievanceModel; 