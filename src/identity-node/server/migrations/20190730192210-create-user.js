'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      goalId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'goals',
          key: 'id'
        },
      },
      name: {
        type: Sequelize.STRING
      },
      givenname: {
        type: Sequelize.STRING
      },
      familyname: {
        type: Sequelize.STRING
      },
      nickname: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      emailverified: {
        type: Sequelize.BOOLEAN
      },
      phone: {
        type: Sequelize.STRING
      },
      timezone: {
        type: Sequelize.STRING
      },
      locale: {
        type: Sequelize.STRING
      },
      isLocked: {
        type: Sequelize.BOOLEAN
      },
      externalid: {
        type: Sequelize.STRING
      },
      profilevisibility: {
        type: Sequelize.INTEGER
      },
      emailnotification: {
        type: Sequelize.BOOLEAN
      },
      identitytoken: {
        type: Sequelize.STRING
      },
      uilanguagebcp47: {
        type: Sequelize.STRING
      },
      avatarurl: {
        type: Sequelize.STRING
      },
      archived: {
        type: Sequelize.BOOLEAN
      },
      authid: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('users');
  }
};