require('dotenv').config();
const db = require('./models');

db.sequelize.sync({ alter: true, logging: console.log })
  .then(() => {
    console.log("SQL DDL generation complete.");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Error generating SQL DDL: " + err.message);
    process.exit(1);
  }); 