import express from "express";
import { getAllUsers, getSingleUser, userStatus } from "../controllers/adminController.js";
import adminMiddleware from "../middleware/adminMiddleware.js";
import userMiddleware from "../middleware/authMiddleware.js";


const adminRouter = express.Router();


adminRouter.get("/users", userMiddleware, adminMiddleware, getAllUsers);
adminRouter.get("/singleuser/:user_id", userMiddleware, adminMiddleware, getSingleUser);
adminRouter.patch("/userstatus/:user_id", userMiddleware, adminMiddleware, userStatus);


export default adminRouter;
