const ticketModel = (sequelize, DataTypes) => {
  const Ticket = sequelize.define('ticket', {
    tkId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    bkId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'bookings',
        key: 'bkId',
      },
    },
    psgId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'passengers',
        key: 'psgId',
      },
    },
    tkNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    tkPricePaid: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    tkStatus: {
      type: DataTypes.ENUM('Confirmed', 'Canceled', 'Refunded'),
      defaultValue: 'Confirmed',
    },
  });

  return Ticket;
};

module.exports = ticketModel; 