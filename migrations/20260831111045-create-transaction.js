'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('transactions', {
      id: {
        type: Sequelize.DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.DataTypes.UUIDV4,
      },

      currencyId: {
        type: Sequelize.DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'currencies',
          key: 'id',
        },
      },

      amount: {
        type: Sequelize.DataTypes.BIGINT,
        allowNull: false,
      },

      sender: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },

      receiver: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },

      reference: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        unique: true,
      },

      type: {
        type: Sequelize.DataTypes.ENUM(
          'TRANSFER',
          'DEPOSIT',
          'WITHDRAWAL',
          'PAYMENT'
        ),
        allowNull: false,
        defaultValue: 'TRANSFER',
      },

      timestamp: {
        type: Sequelize.DataTypes.DATE,
        allowNull: true,
        defaultValue: Sequelize.DataTypes.NOW,
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
    await queryInterface.dropTable('transactions');

    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_transactions_type";'
    );
  },
};