'use strict';

module.exports = (sequelize, DataTypes) => {

  const Project = sequelize.define('Project', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Project requires a name'
        },
        notEmpty: {
          msg: 'Project requires a name'
        }
      },
      unique: {
        args: true,
        msg: 'That project is already registered'
      }
    },
  }, {});

  Project.associate = function(models) {
    Project.belongsToMany(models.Agent, {
      through: 'agent_project'
    });

    Project.belongsToMany(models.Organization, {
      through: 'organization_project'
    });
  };

  return Project;
};
