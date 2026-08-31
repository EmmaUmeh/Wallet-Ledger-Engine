import { QueryTypes, Transaction } from 'sequelize';
import { sequelize } from '../config/database';
import { Wallet } from '../models/wallet.model';
import VirtualAccount from '../models/virtual_account.model';
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

    static async fetchVirtualAccount(userId: string, currencyId: string, transaction?: any) {

        const virtual_account = await VirtualAccount.findOne({
            where: {
                user_id: userId,
                currency_id: currencyId,
            },
            transaction
        });

        if (!virtual_account) {
            throw new Error("Invalid virtual account")
        }

        return virtual_account;
    }




    static async fetchAccountWallet(userId: string, currencyId: string, transaction?: any) {

        const wallet = await Wallet.findOne({
            where: {
                user_id: userId,
                currency_id: currencyId,
            },
            transaction,
            lock: transaction.LOCK.UPDATE
        });

        if (!wallet) {
            throw new Error("Invalid source account")
        }

        return wallet
    }

        static async fetchWalletByVirtualAccount(
        virtualAccountId: string,
        currencyId: string,
        transaction?: Transaction
    ) {
        // First find the receiver's virtual account
        const virtualAccount = await VirtualAccount.findOne({
            where: {
                id: virtualAccountId,
                currency_id: currencyId,
            },
            transaction,
        });

        if (!virtualAccount) {
            throw new Error("Invalid receiver virtual account");
        }

        const wallet = await Wallet.findOne({
            where: {
                user_id: virtualAccount.user_id,
                currency_id: currencyId,
            },
            transaction,

            ...(transaction && {
                lock: transaction.LOCK.UPDATE,
            }),
        });

        if (!wallet) {
            throw new Error("Receiver wallet not found");
        }

        return wallet;
    }


   static async checkBalance(
    userId: string,
    currencyId: string,
    amount: string,
    transaction?: Transaction
) {
    const account = await this.fetchAccountWallet(
        userId,
        currencyId,
        transaction
    ) as any;

    return BigInt(account.balance) >= BigInt(amount);
}


    static async getWalletById(walletId: string) {

        const [wallet] = await sequelize.query(
            `SELECT *
            FROM wallets
            WHERE id = :walletId
            LIMITS 1`,

            {
                replacements: {
                    walletId,
                },
                type: QueryTypes.SELECT,
            }
        )

        if (!wallet) {
            throw new Error("Invalid source account")
        }

        return wallet;
    }

    static async debitWallet(walletId: string, currencyId: string, amount: string, transaction: Transaction) {
        return sequelize.query(`
        UPDATE wallets
        SET balance = balance - :amount
        WHERE id = :walletid AND currency_id = :currencyId
        AND balance >= :amount;
      `, {
            replacements: {
                amount,
                walletId,
                currencyId
            },
            transaction,
            type: QueryTypes.UPDATE
            
        })
    }

    static async creditWallet(walletId: string, amount: string, currencyId: string, transaction: Transaction) {
        return sequelize.query(`
          UPDATE wallets
          SET balance = balance + :amount
          WHERE id = :walletId AND currency_id = :currencyId
        `, {
            replacements: {
                walletId,
                amount: amount,
                currencyId
            },
            transaction,
            type: QueryTypes.UPDATE
        })
    }

}

export default WalletService;