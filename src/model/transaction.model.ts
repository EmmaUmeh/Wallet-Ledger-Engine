

class Transaction extends Model { }


export enum TransactionType {
    CREDIT = "credit",
    DEBIT = "debit",
}

Transaction.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
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
    status: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    type: {
        type: DataTypes.ENUM(...Object.values(TransactionType)),
        allowNull: false,
        defaultValue: TransactionType.CREDIT
    },
    timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
})