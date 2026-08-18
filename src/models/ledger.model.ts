const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = new Sequelize('sqlite::memory:');

class LedgerEntry extends Model {}

LedgerEntry.init({
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
    },

    transactionId: {
        type: DataTypes.UUID,
        allowNull: false,
    },

    accountId: {
        type: DataTypes.UUID,
        allowNull: false,
    },

    debit: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 0,
    },

    credit: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 0,
    },

}, {
    sequelize,
    tableName: "ledger",
    timestamps: true,
});

export { LedgerEntry};