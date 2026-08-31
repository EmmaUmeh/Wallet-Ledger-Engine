'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'email', {
      type: Sequelize.DataTypes.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'email');
  },
};