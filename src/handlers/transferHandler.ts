import { Request, Response } from "express";
import CreateWalletService from "../service/wallet.service";
import { User } from "../models/user.model";
import { HTTPStatus } from "../utils/http.utils";
import WalletService from "../service/wallet.service";
import { getUserLock } from "../utils/lock.utils";
import { Transaction, TransactionType } from "../models/transaction.model";
import { LedgerEntry } from "../models/ledger.model";
import { sequelize } from "../config/database";
import { VirtualAccount } from "../models/virtual_account.model";




const handleInternalTransfer = async (req: Request, res: Response) => {
    // Peer to peer wallet transfer
    const {
        currency_id,
        reference,
        receiverVirtualAccountId,
        amount,
    } = req.body;

    const userId = req.user.id as any;

    const userLock = getUserLock(userId);

    return userLock.runExclusive(async () => {
        const dbtransaction = await sequelize.transaction();

        try {

            const user = await User.findOne({
                where: {
                    id: userId,
                },
                transaction: dbtransaction,
                lock: dbtransaction.LOCK.UPDATE,
            });

            if (!user) {
                return res
                    .status(HTTPStatus.NOT_FOUND)
                    .json("Resource not found.");
            }

            // 2. Check sender wallet
            const wallet = await WalletService.fetchAccountWallet(
                userId,
                currency_id,
                dbtransaction
            );


            const balance = await WalletService.checkBalance(userId, amount)
            
            if(balance){
                throw new Error("Insufficient balance")
            }


            const virtual_account = await WalletService.fetchVirtualAccount(userId, currency_id, dbtransaction)


           if(!virtual_account) {
              throw new Error("Invalid virtual account")
            }

          
            const txn: any = await Transaction.create(
                {
                    currencyId: currency_id,
                    amount,
                    receiverVirtualAccountId,
                    reference,
                    type: TransactionType.TRANSFER,
                },
                {
                    transaction: dbtransaction,
                }
            );

            // 4. Create debit entry for sender
            await LedgerEntry.create(
                {
                    transactionId: txn?.id,
                    accountId: receiverVirtualAccountId,
                    currencyId: currency_id,
                    debit: amount,
                    reference: reference,
                },
                {
                    transaction: dbtransaction,
                }
            );

            // 5. Create credit entry for receiver
            await LedgerEntry.create(
                {
                    transactionId: txn.id,
                    accountId: receiverVirtualAccountId,
                    currencyId: currency_id,
                    credit: amount,
                    reference: reference,
                },
                {
                    transaction: dbtransaction,
                }
            );

            // 6. Commit everything
            await dbtransaction.commit();

            return res.status(HTTPStatus.OK).json({
                message: "Transfer successful.",
                reference: txn.reference,
            });

        } catch (error) {
            await dbtransaction.rollback();

            console.error(
                "Internal transfer failed:",
                error
            );

            return res
                .status(HTTPStatus.INTERNAL_SERVER_ERROR)
                .json("An error occurred while processing the transfer request.");
        }
    });
};

export default handleInternalTransfer;