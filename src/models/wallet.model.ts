import { DataTypes, Model } from "sequelize"
import { sequelize } from "../config/database"

export enum WalletStatus {
  BLOCKED = "blocked",
  ACTIVE = "active",
  FROZEN = "frozen",
}

class Wallet extends Model {
  declare id: string;
  declare user_id: string;
  declare balance: bigint;
  declare currency_id: number;
  declare status: WalletStatus;
}

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
      type: DataTypes.ENUM(
        WalletStatus.ACTIVE,
        WalletStatus.FROZEN,
        WalletStatus.BLOCKED
      ),
      allowNull: false,
      defaultValue: WalletStatus.ACTIVE,
    },
  },
  {
    sequelize,
    modelName: "Wallet",
    tableName: "wallets",
    timestamps: true,
  }
);

export { Wallet };