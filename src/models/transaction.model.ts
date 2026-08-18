import { DataTypes, Model } from "sequelize"
import { sequelize } from "../config/database"


export enum TransactionType {
    TRANSFER = "transfer",
    DEPOSIT = "deposit",
    WITHDRAWAL = "withdrawal",
    FEE = "fee",
    REFUND = "refund",
}

class Transaction extends Model<any> { }


Transaction.init({
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false
    },
    currencyId: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
    },
    amount: {
        type: DataTypes.BIGINT,
        allowNull: false
    },

    sender: {
        type: DataTypes.STRING,
        allowNull: false
    },
    receiver: {
        type: DataTypes.STRING,
        allowNull: false
    },
    // status: {
    //     type: DataTypes.BOOLEAN,
    //     allowNull: false
    // },
    type: {
        type: DataTypes.ENUM(...Object.values(TransactionType)),
        allowNull: false,
        defaultValue: TransactionType.TRANSFER
    },
    timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
},
 {
        sequelize,
        tableName: "transactions",
        timestamps: true,
    }
)

export { Transaction }