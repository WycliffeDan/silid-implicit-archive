'use strict';
module.exports = (sequelize, DataTypes) => {
  const app = sequelize.define('app', {
    guid: DataTypes.INTEGER,
    uniquekey: DataTypes.STRING,
    name: DataTypes.STRING,
    orgsMustVerify: DataTypes.STRING,
    usersMustVerify: DataTypes.STRING,
    orgVerificationEmail: DataTypes.STRING,
    userVerificationEmail: DataTypes.STRING,
    orgCreationEndpoint: DataTypes.STRING,
    userCreationEndpoint: DataTypes.STRING,
    active: DataTypes.BOOLEAN
  }, {});
  app.associate = function(models) {
    // associations can be defined here
  };
  return app;
};