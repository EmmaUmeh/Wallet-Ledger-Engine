import { DataTypes, Model } from "sequelize"
import { sequelize } from "../config/database"


class Wallet extends Model {}

Wallet.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },

    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    balance: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0,
    },

    currency_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    status: {
      type: DataTypes.ENUM('active', 'frozen', 'blocked'),
      allowNull: false,
      defaultValue: 'active',
    },
  },
  {
    sequelize,
    modelName: 'Wallet',
    tableName: 'wallets',
    timestamps: true,
  }
);

export { Wallet };