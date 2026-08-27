import { CronJob } from "cron";

export function startReconciliation() {
  const job = new CronJob(
    "*/5 * * * *",
    () => {
      console.log("Running reconciliation...");
    }
  );

  job.start();
}