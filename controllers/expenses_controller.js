import { User, Expenses } from "../models/expenses_model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  expenseValidator,
  loginValidator,
  registerValidator,
} from "../validators/expenses_validator.js";

export const registerUser = async (req, res) => {
  try {
    const { error, value } = registerValidator.validate(
      { ...req.body },
      { abortEarly: false }
    );
    if (error)
      return res
        .status(400)
        .json({ errors: error.details.map((err) => err.message) });

    const { username, email, password } = req.body;
    if (await User.findOne({ email })) {
      return res.status(400).json({ message: "User already exist" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });

    await newUser.save();
    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { error, value } = loginValidator.validate(
      { ...req.body },
      { abortEarly: false }
    );
    if (error)
      return res
        .status(400)
        .json({ errors: error.details.map((err) => err.message) });

    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });
    res.json({
      token,
      user: { id: user._id, username: user.username, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addExpense = async (req, res) => {
  try {
    const { error, value } = expenseValidator.validate(
      { ...req.body },
      { abortEarly: false }
    );
    if (error)
      return res
        .status(400)
        .json({ errors: error.details.map((err) => err.message) });

    const { item, amount, category, payment, status } = req.body;

    if (!item || !amount || !category || !payment || !status) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const expense = new Expenses({
      user: req.user?.id,
      item,
      amount,
      category,
      payment,
      status,
    });

    const result = await expense.save();
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getExpenses = async (req, res, next) => {
  try {
    const { filter = "{}", sort = "{}" } = req.query;
    const expenses = await Expenses.find(JSON.parse(filter)).sort(
      JSON.parse(sort)
    );

    res.json(expenses);
  } catch (error) {
    next(error);
  }
};

export const getExpenseById = async (req, res, next) => {
  try {
    const expense = await Expenses.findById(req.params.id);

    if (!expense) return res.status(404).json({ message: "Expense not found" });

    res.json(expense);
  } catch (error) {
    next(error);
  }
};

export const deleteExpense = async (req, res, next) => {
  try {
    const expense = await Expenses.findById(req.params.id);

    if (!expense) return res.status(404).json({ message: "Expense not found" });

    await expense.deleteOne();
    res.json({ message: "Expense deleted successfully" });
  } catch (error) {
    next(error);
  }
};
