import { Wallet } from '../models/wallet.model';


const CreateWalletService = async (userId: any, currency_id: any) => {
    const transaction = sequelize.transaction();

    try {
        const wallet = await Wallet.create({
            user_id: userId,
            currency_id: currency_id,
        },
            { transaction }
        );
        await transaction.commit();
        return wallet;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

export default CreateWalletService;