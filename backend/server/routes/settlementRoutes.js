import express from "express";
import {
    cashPayment,
    getGroupSettlements,
    getSettlementDetails,
    getFriendSettlements
} from "../controllers/settlementController.js";
import userMiddleware from "../middleware/authMiddleware.js";


const settlementRouter = express.Router();


settlementRouter.post("/cash/friend/:friend_id/:toUser_id", userMiddleware, cashPayment);
settlementRouter.post("/cash/group/:group_id/:toUser_id", userMiddleware, cashPayment);
settlementRouter.get("/group/:group_id", userMiddleware, getGroupSettlements);
settlementRouter.get("/friend/:friend_id", userMiddleware, getFriendSettlements);
settlementRouter.get("/details/:settlement_id", userMiddleware, getSettlementDetails);


export default settlementRouter;
