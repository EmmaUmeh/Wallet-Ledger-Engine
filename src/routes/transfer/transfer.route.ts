import handleInternalTransfer from "../../handlers/transferHandler";
import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";


const route = Router();


route.post("/transfer", authenticate, handleInternalTransfer)

export default route;