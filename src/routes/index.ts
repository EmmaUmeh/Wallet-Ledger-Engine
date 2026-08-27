import { Router } from "express"
import express from  "express"
import transferRoutes from "./transfer/index"

const route = express.Router();


route.use("virtual-account", transferRoutes);

export default route;