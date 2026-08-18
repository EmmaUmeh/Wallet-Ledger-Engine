

class UserTier extends Model { }

enum UserTierEnum {
    tier1 = "1",
    tier2 = "2",
    tier3 = "3",
}

UserTier.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
    },
    tier: {
        type: DataTypes.ENUM(...Object.values(UserTierEnum)),
        defaultValue: UserTierEnum.tier1,
        allowNull: false
    },
    createdAt: {
        type: DataTypes.DATE,
    }

},

    {
        sequelize,
        tableName: "user_tiers",
        timestamps: true,
    })