'use strict';

module.exports = (sequelize, DataTypes) => {

  const Organization = sequelize.define('Organization', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Organization requires a name'
        }
      },
      unique: {
        args: true,
        msg: 'That organization is already registered'
      }
    },
  }, {});

  Organization.associate = function(models) {
    Organization.belongsToMany(models.Agent, {
      through: 'agent_organization'
    });
  };

  return Organization;
};
