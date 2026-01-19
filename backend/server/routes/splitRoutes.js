import express from "express";
import { getSplitAmount } from "../controllers/splitController.js";
import userMiddleware from "../middleware/authMiddleware.js";


const splitRouter = express.Router();


splitRouter.get("/get/:expense_id", userMiddleware, getSplitAmount);



export default splitRouter;
