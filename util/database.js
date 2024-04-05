const Sequelize = require('sequelize');

const sequelize = new Sequelize('node-new-complete', 'root', 'NRS842@&$#sha*', {
  dialect: 'mysql',
  host: 'localhost'
});

module.exports = sequelize;