const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = new Sequelize('sqlite::memory:');

class Ledger extends Model {}

Ledger.init(
  {

    reference: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    amount: {
        type: DataTypes.BIGINT,
        allowNull: false,
    },
    balanceBefore: {
        type: DataTypes.BIGINT,
        allowNull: false,
    },
    balanceAfter:{
        type: DataTypes.BIGINT,
        allowNull: false,
    },
    currencyId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    type: {
     type: DataTypes.ENUM('credit', 'debit', 'fee', 'vat'),
     allowNull: false,
    },
    metadata: {
        type: DataTypes.JSON,
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    }

  },
  {
    sequelize,
    modelName: 'Ledger',
  }
);

module.exports = Ledger;