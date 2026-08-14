// const { Sequelize, DataTypes } = require('sequelize');
// const sequelize = new Sequelize('sqlite::memory:');

class Wallet extends Model {}

Wallet.init({
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        // autoIncrement: true,
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
    },
    balance: {
        type: DataTypes.BIGINT,
        allowNull: false,
    },
    currencyId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }

})