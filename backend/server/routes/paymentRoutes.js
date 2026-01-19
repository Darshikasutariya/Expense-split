import express from "express";
import { createOnlinePayment, getPaymentDetails, allPayments } from "../controllers/paymentController.js";
import userMiddleware from "../middleware/authMiddleware.js";

const paymentRouter = express.Router();

paymentRouter.post("/online/friend/:friend_id/:toUser_id", userMiddleware, createOnlinePayment);
paymentRouter.post("/online/group/:group_id/:toUser_id", userMiddleware, createOnlinePayment);

paymentRouter.get("/details/:paymentId", userMiddleware, getPaymentDetails);
paymentRouter.get("/all/user/:user_id", userMiddleware, allPayments);

export default paymentRouter;
