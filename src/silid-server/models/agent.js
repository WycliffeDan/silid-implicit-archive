'use strict';
module.exports = (sequelize, DataTypes) => {
  const agent = sequelize.define('Agent', {
    // attributes
    name: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {});

  return agent;
};
