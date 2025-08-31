const ratingModel = (sequelize, DataTypes) => {
  const Rating = sequelize.define('rating', {
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
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
      },
    },
    feedback: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
  }, {
    indexes: [
      {
        unique: true,
        fields: ['usrId', 'fltId'],
      },
    ],
  });

  return Rating;
};

module.exports = ratingModel;
