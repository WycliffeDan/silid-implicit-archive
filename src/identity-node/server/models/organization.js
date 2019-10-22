'use strict';
module.exports = (sequelize, DataTypes) => {
  const organization = sequelize.define('organization', {
    guid: DataTypes.INTEGER,
    uniquekey: DataTypes.STRING,
    code: DataTypes.INTEGER,
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    logo: DataTypes.STRING,
    verified: DataTypes.BOOLEAN,
    verifiedby: DataTypes.STRING,
    verifieddate: DataTypes.TIME,
    active: DataTypes.BOOLEAN,
    userId: DataTypes.INTEGER,
    websiteurl: DataTypes.STRING
  }, {});
  organization.associate = function(models) {
    // associations can be defined here
  };
  return organization;
};