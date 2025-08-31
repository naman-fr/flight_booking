const ticketModel = (sequelize, DataTypes) => {
  const Ticket = sequelize.define('ticket', {
    tktId: {
      type: DataTypes.STRING(5),
      primaryKey: true,
      allowNull: false,
    },
    bkId: {
      type: DataTypes.STRING(5),
      allowNull: false,
      references: {
        model: 'bookings',
        key: 'bkId'
      }
    },
    psgId: {
      type: DataTypes.STRING(5),
      allowNull: false,
      references: {
        model: 'passengers',
        key: 'psgId'
      }
    },
    tktSeatNum: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    tktStatus: {
      type: DataTypes.ENUM('U', 'C', 'P', 'R', 'W'),
      defaultValue: 'U',
    },
    tktRemark: {
      type: DataTypes.STRING(15),
      allowNull: true,
    },
  });

  return Ticket;
};

module.exports = ticketModel;
