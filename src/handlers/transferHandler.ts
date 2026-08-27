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
        currency_id,
        reference,
        receiverVirtualAccountId,
        amount,
    } = req.body;

    if (!req.user) {
        return res
            .status(HTTPStatus.UNAUTHORIZED)
            .json("Unauthorized.");
    }

    const userId = req.user.id;

    const userLock = getUserLock(userId);

    return userLock.runExclusive(async () => {
        const transaction = await sequelize.transaction();

        try {
            const user = await User.findOne({
                where: {
                    id: userId,
                },
                transaction,
                lock: transaction.LOCK.UPDATE,
            });

            if (!user) {
                return res
                    .status(HTTPStatus.NOT_FOUND)
                    .json("Resource not found.");
            }

            const wallet = await WalletService.fetchAccountWallet(
                userId,
                currency_id,
                transaction
            );

            if (!wallet) {
                throw new Error("Wallet not found.");
            }

            if (wallet.status === "blocked" || wallet.status === "frozen") {
                    throw new Error("Transaction unavailable for this account.");
            }

            const balance = await WalletService.checkBalance(
                userId,
                currency_id,
                amount,
                transaction
            );

            if (balance) {
                throw new Error("Insufficient balance");
            }

            const virtual_account =
                await WalletService.fetchVirtualAccount(
                    userId,
                    currency_id,
                    transaction
                );

            if (!virtual_account) {
                throw new Error("Invalid virtual account");
            }

            const existing_transaction = await Transaction.findOne({
                where: {
                    reference,
                },
                transaction,
            });

            if (existing_transaction) {
                throw new Error("Transfer already processed.");
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
                    transaction,
                }
            );

            await LedgerEntry.create(
                {
                    transactionId: txn.id,
                    accountId: virtual_account.id,
                    currencyId: currency_id,
                    debit: amount,
                    reference,
                },
                {
                    transaction,
                }
            );

            await LedgerEntry.create(
                {
                    transactionId: txn.id,
                    accountId: receiverVirtualAccountId,
                    currencyId: currency_id,
                    credit: amount,
                    reference,
                },
                {
                    transaction,
                }
            );

            await transaction.commit();

            return res.status(HTTPStatus.OK).json({
                message: "Transfer successful.",
                reference: txn.reference,
            });

        } catch (error) {
            await transaction.rollback();

            return res
                .status(HTTPStatus.INTERNAL_SERVER_ERROR)
                .json("Transfer Failed. Please Try again.");
        }
    });
};

export default handleInternalTransfer;