import express from "express";
import userRouter from "./userRoutes.js";
import friendRouter from "./friendRoutes.js";
import authRouter from "./authRoutes.js";
import groupRouter from "./groupRoutes.js";
import expenseRouter from "./expenseRoutes.js";
import splitRouter from "./splitRoutes.js";
import balanceRouter from "./balanceRoutes.js";
import paymentRouter from "./paymentRoutes.js";
import settlementRouter from "./settlementRoutes.js";
import webhookRouter from "./webhookRoutes.js";
import notificationRouter from "./notificationRoutes.js";
import adminRouter from "./adminRoutes.js";
import activityLogRouter from "./activityLogRoutes.js";

const indexRouter = express.Router();

indexRouter.use('/auth', authRouter);
indexRouter.use('/user', userRouter)
indexRouter.use('/friend', friendRouter);
indexRouter.use('/group', groupRouter);
indexRouter.use('/expense', expenseRouter);
indexRouter.use('/split', splitRouter);
indexRouter.use('/balance', balanceRouter);
indexRouter.use('/payment', paymentRouter);
indexRouter.use('/settlement', settlementRouter);
indexRouter.use('/webhook', webhookRouter);
indexRouter.use('/notification', notificationRouter);
indexRouter.use('/auth/admin', adminRouter);
indexRouter.use('/activitylog', activityLogRouter);

export default indexRouter;

