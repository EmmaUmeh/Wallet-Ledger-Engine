import { Request, Response } from "express";
import CreateWalletService from "../service/wallet.service";
import { User } from "../models/user.model";
import { HTTPStatus } from "../utils/http.utils";
import WalletService from "../service/wallet.service";
import { getUserLock } from "../utils/lock.utils";
import { Transaction, TransactionType } from "../models/transaction.model";
import { LedgerEntry } from "../models/ledger.model";
import { sequelize } from "../config/database";




const handleInternalTransfer = async (req: Request, res: Response) => {
    const {
        userId,
        currency_id,
        reference,
        receiver,
        sender,
        amount,
    } = req.body;

    const userLock = getUserLock(userId);

    return userLock.runExclusive(async () => {
        const dbTransaction = await sequelize.transaction();

        try {

            const user = await User.findOne({
                where: {
                    id: userId,
                },
                transaction: dbTransaction,
                lock: dbTransaction.LOCK.UPDATE,
            });

            if (!user) {
                await dbTransaction.rollback();

                return res
                    .status(HTTPStatus.NOT_FOUND)
                    .json("Resource not found.");
            }

            // 2. Check sender wallet
            const wallet = await WalletService.checkWalletExists(
                userId,
                currency_id,
                dbTransaction
            );

            if (!wallet) {
                await dbTransaction.rollback();

                return res
                    .status(HTTPStatus.BAD_REQUEST)
                    .json("Transfer Request Failed. Please try again.");
            }

            // 3. Create the transaction record
            const txn: any = await Transaction.create(
                {
                    currencyId: currency_id,
                    amount,
                    sender,
                    receiver,
                    reference,
                    type: TransactionType.TRANSFER,
                },
                {
                    transaction: dbTransaction,
                }
            );

            // 4. Create debit entry for sender
            await LedgerEntry.create(
                {
                    transactionId: txn?.id,
                    accountId: sender,
                    currencyId: currency_id,
                    debit: amount,
                },
                {
                    transaction: dbTransaction,
                }
            );

            // 5. Create credit entry for receiver
            await LedgerEntry.create(
                {
                    transactionId: txn.id,
                    accountId: receiver,
                    currencyId: currency_id,
                    credit: amount,
                },
                {
                    transaction: dbTransaction,
                }
            );

            // 6. Commit everything
            await dbTransaction.commit();

            return res.status(HTTPStatus.OK).json({
                message: "Transfer successful.",
                reference: txn.reference,
            });

        } catch (error) {
            await dbTransaction.rollback();

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