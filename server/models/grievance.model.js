const grievanceModel = (sequelize, DataTypes) => {
  const Grievance = sequelize.define('grievance', {
    grvId: {
      type: DataTypes.STRING(5),
      primaryKey: true,
      allowNull: false,
    },
    usrId: {
      type: DataTypes.STRING(5),
      allowNull: false,
      references: {
        model: 'users',
        key: 'userId'
      }
    },
    fltId: {
      type: DataTypes.STRING(5),
      allowNull: false,
      references: {
        model: 'flights',
        key: 'fltId'
      }
    },
    complaint: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    response: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('P', 'R'),
      defaultValue: 'P',
    },
  });

  return Grievance;
};

module.exports = grievanceModel;
