'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('currencies', {
      id: {
        type: Sequelize.DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.DataTypes.UUIDV4,
      },

      name: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },

      symbol: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },

      code: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },

      createdAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
      },

      updatedAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('currencies');
  },
};