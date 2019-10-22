'use strict';
module.exports = (sequelize, DataTypes) => {
  const membership = sequelize.define('membership', {
    userId: DataTypes.INTEGER,
    orgId: DataTypes.INTEGER
  }, {});
  membership.associate = function(models) {
    // associations can be defined here
  };
  return membership;
};