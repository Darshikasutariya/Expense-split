import express from "express";
import { addExpense, editExpense, deleteExpense, getFriendExpenses, getGroupExpenses, getExpenseDetails } from "../controllers/expenseController.js";
import userMiddleware from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validationMiddleware.js";
import { addExpenseSchema, editExpenseSchema } from "../validation/expense.js";


const expenseRouter = express.Router();


expenseRouter.post("/add/group/:group_id", userMiddleware, validate(addExpenseSchema), addExpense);
expenseRouter.post("/add/friend/:friend_id", userMiddleware, validate(addExpenseSchema), addExpense);
expenseRouter.put("/edit/:expense_id", userMiddleware, validate(editExpenseSchema), editExpense);
expenseRouter.delete("/delete/:expense_id", userMiddleware, deleteExpense);
expenseRouter.get("/getFriendExpenses/:friend_id", userMiddleware, getFriendExpenses);
expenseRouter.get("/getGroupExpenses/:group_id", userMiddleware, getGroupExpenses);
expenseRouter.get("/getExpenseDetails/:expense_id", userMiddleware, getExpenseDetails);



export default expenseRouter;
