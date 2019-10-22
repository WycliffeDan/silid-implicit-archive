'use strict';
module.exports = (sequelize, DataTypes) => {
  const goal = sequelize.define('goal', {
    userId: DataTypes.INTEGER,
    name: DataTypes.STRING
  }, {});
  goal.associate = function(models) {
    // associations can be defined here
  };
  return goal;
};