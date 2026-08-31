import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";


class CurrencyModel extends Model { }

CurrencyModel.init({
    id: {
        type: DataTypes.UUID,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },

    symbol: {
        type: DataTypes.STRING,
        allowNull: false
    },
    code: {
        type: DataTypes.STRING,
        allowNull: false
    },


},
    {
        sequelize,
        tableName: "currencies",
        timestamps: true
    })