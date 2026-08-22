import { QueryTypes } from 'sequelize';
import { sequelize } from '../config/database';
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

    
    

    static async fetchAccountWallet(userId: string, currencyId: string) {

            const wallet = await Wallet.findOne({
                where: {
                    user_id: userId,
                    currency_id: currencyId,
                },
            });
            
            if(!wallet) {
              throw new Error("Invalid source account")
            }
    }

     static async checkBalance(userId: string, amount: string) {
       const account = this.fetchAccountWallet(userId, amount)
       return amount > account.balance;
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

         if(!wallet) {
              throw new Error("Invalid source account")
            }

        return wallet;
    }

    static async debitWallet(walletId: string, currencyId: string, amount: string) {
      return sequelize.query(`
        UPDATE wallets
        SET balance = balance - :amount
        WHERE id = :walletid AND currency_id = :currencyId
        AND balance >= :amount;
      `, {
        replacements: {
            amount,
            walletId
        },
        type: QueryTypes.UPDATE
      })
    }

    static async creditWallet(walletId: string, amount: string, currencyId?: string) {
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
            type: QueryTypes.UPDATE
        })
    }

}

export default WalletService;