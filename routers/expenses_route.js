import express from "express";
import { registerUser, loginUser, addExpense, deleteExpense, getExpenseById, getExpenses } from "../controllers/expenses_controller.js";
import auth from "../middlewares/expenses_middleware.js"; 

const router = express.Router();

router.post("/auth/register", registerUser);
router.post("/auth/login", loginUser);


router.post("/expenses", auth, addExpense);  //  Requires authentication
router.get("/expenses", getExpenses);       
router.get("/expenses/:id", getExpenseById); 
router.delete("/expenses/:id", auth, deleteExpense); // requiries authentication

export default router;
