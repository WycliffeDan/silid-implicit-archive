'use strict';
module.exports = (sequelize, DataTypes) => {
  const invite = sequelize.define('invite', {
    email: DataTypes.STRING,
    orgId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER
  }, {});
  invite.associate = function(models) {
    // associations can be defined here
  };
  return invite;
};