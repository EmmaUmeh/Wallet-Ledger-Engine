import { Model, DataTypes, CreationOptional } from "sequelize";
import { sequelize } from "../config/database";

class VirtualAccount extends Model {
    declare id: CreationOptional<string>;
    declare user_id: string;
    declare currency_id: string;
    declare account_number: string;
}

VirtualAccount.init({
    id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: "users",
            key: "id"
        }
    },
    currency_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: "currencies",
            key: "id"
        }
    },
    account_number: {
        type: DataTypes.STRING,
    }
}, {
    sequelize,
    tableName: "virtual_accounts",
    timestamps: true,
});

export default VirtualAccount;