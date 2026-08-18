import { DataTypes, Model } from "sequelize"
import { sequelize } from "../config/database"


class User extends Model{}

User.init({
    id: {
        type: DataTypes.UUID,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    firstName: {
        type: DataTypes.STRING,
    },
    lastName: {
        type: DataTypes.STRING
    },
    createdBy: {
        type: DataTypes.DATE,
    }
},
{
        sequelize,
        tableName: "users",
        timestamps: true,
})

export { User }