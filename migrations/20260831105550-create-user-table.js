'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("users", {
      id: {
        type: Sequelize.DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.DataTypes.UUIDV4
      },

      password: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },

      firstName: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },

      lastName: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },

      user_name: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false
      },
      createdBy: {
        type: Sequelize.DataTypes.DATE,
        allowNull: true,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("users")
  }
};
