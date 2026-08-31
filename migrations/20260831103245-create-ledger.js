"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("ledger", {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
      },

      transactionId: {
        type: Sequelize.UUID,
        allowNull: false,
      },

      accountId: {
        type: Sequelize.UUID,
        allowNull: false,
      },

      debit: {
        type: Sequelize.BIGINT,
        allowNull: false,
        defaultValue: 0,
      },

      credit: {
        type: Sequelize.BIGINT,
        allowNull: false,
        defaultValue: 0,
      },

      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },

      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("ledger");
  },
};