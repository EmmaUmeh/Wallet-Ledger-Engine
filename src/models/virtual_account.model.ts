
import { DataTypes, Model } from "sequelize"
import { sequelize } from "../config/database"



class VirtualAccount extends Model{}
VirtualAccount.init({

  id: {
   type: DataTypes.UUID,
   allowNull: false,
   primaryKey: false,
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


},

   {
        sequelize,
        tableName: "virtual_accounts",
        timestamps: true,
    }
)

export { VirtualAccount }