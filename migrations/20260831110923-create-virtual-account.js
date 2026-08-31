'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('virtual_account', {
      id: {
        type: Sequelize.DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.DataTypes.UUIDV4,
      },

      user_id: {
        type: Sequelize.DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
      },

      currency_id: {
        type: Sequelize.DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'currencies',
          key: 'id',
        },
      },

      account_number: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('virtual_account');
  },
};