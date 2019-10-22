'use strict';
module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    name: DataTypes.STRING,
    givenname: DataTypes.STRING,
    familyname: DataTypes.STRING,
    nickname: DataTypes.STRING,
    email: DataTypes.STRING,
    emailverified: DataTypes.BOOLEAN,
    phone: DataTypes.STRING,
    timezone: DataTypes.STRING,
    locale: DataTypes.STRING,
    isLocked: DataTypes.BOOLEAN,
    externalid: DataTypes.STRING,
    profilevisibility: DataTypes.INTEGER,
    emailnotification: DataTypes.BOOLEAN,
    identitytoken: DataTypes.STRING,
    uilanguagebcp47: DataTypes.STRING,
    avatarurl: DataTypes.STRING,
    archived: DataTypes.BOOLEAN,
    authid: DataTypes.STRING
  }, {});
  user.associate = function(models) {
    // associations can be defined here
  };
  return user;
};