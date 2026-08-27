import { LedgerEntry } from "../models/ledger.model";
import { Wallet } from "../models/wallet.model";
import { Op } from "sequelize";
import { sequelize } from "../config/database";

class ReconciliationService {
  static async reconcileWallet() {
    const BATCH_SIZE = 500;

    const totalWallets = await Wallet.count();

    for (let offset = 0; offset < totalWallets; offset += BATCH_SIZE) {
      const wallets = await Wallet.findAll({
        attributes: ["id", "balance"],
        limit: BATCH_SIZE,
        offset,
        order: [["createdAt", "ASC"]],
      });

      const walletIds = wallets.map((wallet) => wallet?.id);

      const ledgerBalances = await LedgerEntry.findAll({
        attributes: [
          "accountId",
          [
            sequelize.fn(
              "SUM",
              sequelize.literal("credit - debit")
            ),
            "balance",
          ],
        ],
        where: {
          accountId: {
            [Op.in]: walletIds,
          },
        },
        group: ["accountId"],
        raw: true,
      });

      const ledgerBalanceMap = new Map(
        ledgerBalances.map((entry: any) => [
          entry.accountId,
          BigInt(entry.balance ?? 0),
        ])
      );

      for (const wallet of wallets) {
        const walletBalance = BigInt(wallet.balance);
        const ledgerBalance =
          ledgerBalanceMap.get(wallet.id) ?? 0n;

        if (walletBalance !== ledgerBalance) {
          await wallet.update({
            status: "blocked",
          });

          console.log(
            `Wallet ${wallet.id} blocked due to reconciliation mismatch`
          );
        }
      }
    }
  }
}

export default ReconciliationService;