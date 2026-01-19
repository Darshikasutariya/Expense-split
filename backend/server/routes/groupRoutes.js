import express from "express";
import { addMember, createGroup, deleteGroup, editGroup, removeMember, getGroupList } from "../controllers/groupController.js";
import userMiddleware from "../middleware/authMiddleware.js";
import checkUserAdminOrMember from "../middleware/groupMiddleware.js";
import { validate } from "../middleware/validationMiddleware.js";
import { createGroupSchema, editGroupSchema, addMemberSchema, removeMemberSchema } from "../validation/group.js";


const groupRouter = express.Router();


groupRouter.post("/create", userMiddleware, validate(createGroupSchema), createGroup);
groupRouter.put("/edit/:group_id", userMiddleware, checkUserAdminOrMember, validate(editGroupSchema), editGroup);
groupRouter.delete("/delete/:group_id", userMiddleware, checkUserAdminOrMember, deleteGroup);
groupRouter.post("/addMember/:group_id", userMiddleware, checkUserAdminOrMember, validate(addMemberSchema), addMember);
groupRouter.delete("/removeMember/:group_id", userMiddleware, checkUserAdminOrMember, validate(removeMemberSchema), removeMember);
groupRouter.get("/getGroupList", userMiddleware, getGroupList);


export default groupRouter;
