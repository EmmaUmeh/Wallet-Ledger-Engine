import express from "express";
import dotenv from "dotenv";
import { sequelize } from "./config/database";
import route from "./routes/index";

dotenv.config();

const app = express();

const PORT = process?.env?.PORT;

app.use(express.json());
app.use("/v1", route)

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
  });
});

async function startServer() {
  try {
    await sequelize.authenticate();

    console.log("PostgreSQL connected successfully");

    await sequelize.sync();

    console.log("Database synchronized");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();