var Sequelize = require('sequelize')
module.exports = function(sequelize, DataTypes){
  var ratings = sequelize.define('ratings', { 
      crazy_rating: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      hot_rating: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      timestamp: {
        type: Sequelize.DATE,
        allowNull: false,
        primaryKey: true
      },
      comments: {
        type: Sequelize.STRING(length = "1024"),
        allowNull: false,
        primaryKey: true
      },
      ip: {
        type: Sequelize.STRING(length = "255"),
        allowNull: false,
        primaryKey: true
      },
      username: {
        type: Sequelize.STRING(length = "255"),
        allowNull: false,
        primaryKey: true
      },
      site: {
        type: Sequelize.STRING(length = "255"),
        allowNull: false,
        primaryKey: true
      },
      display_name: {
        type: Sequelize.STRING(length = "255"),
        allowNull: false,
        primaryKey: true
      }
    });

    return ratings;
};