import { Wallet } from '../models/wallet.model';

class WalletService {
    static async createWallet(userId: string, currencyId: string) {
        const transaction = await sequelize.transaction();

        try {
            const wallet = await Wallet.create(
                {
                    user_id: userId,
                    currency_id: currencyId,
                },
                { transaction }
            );

            await transaction.commit();

            return wallet;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    static async checkWalletExists(userId: string, currencyId: string, transaction: any) {
        try {
            const wallet = await Wallet.findOne({
                where: {
                    user_id: userId,
                    currency_id: currencyId,
                },
                transaction,
            });
            return wallet !== null;
        } catch (err) {
            throw err;
        }
    }

    static async getWalletById(walletId: string) {
        return await Wallet.findOne({
            where: {
                id: walletId,
            },
        });
    }
}

export default WalletService;