import { DataTypes, Model } from "sequelize"
import { sequelize } from "../config/database"


class User extends Model{}
User.init(
    {
        id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },

        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        user_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        createdBy: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    },
    {
        sequelize,
        tableName: "users",
        timestamps: true,
    }
);

export { User };