'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('apps', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      guid: {
        type: Sequelize.INTEGER
      },
      uniquekey: {
        type: Sequelize.STRING
      },
      name: {
        type: Sequelize.STRING
      },
      orgsMustVerify: {
        type: Sequelize.STRING
      },
      usersMustVerify: {
        type: Sequelize.STRING
      },
      orgVerificationEmail: {
        type: Sequelize.STRING
      },
      userVerificationEmail: {
        type: Sequelize.STRING
      },
      orgCreationEndpoint: {
        type: Sequelize.STRING
      },
      userCreationEndpoint: {
        type: Sequelize.STRING
      },
      active: {
        type: Sequelize.BOOLEAN
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
    return queryInterface.dropTable('apps');
  }
};