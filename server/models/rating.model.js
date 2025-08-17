const ratingModel = (sequelize, DataTypes) => {
  const Rating = sequelize.define('rating', {
    ratingId: {
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
    ratingValue: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
      },
    },
    ratingComment: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });

  return Rating;
};

module.exports = ratingModel; 