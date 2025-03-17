import { User, Expenses } from "../models/expenses_model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  expenseValidator,
  loginValidator,
  registerValidator,
} from "../validators/expenses_validator.js";

/// THERE ARE A LOT OF COMMENT IN THIS FILE HOPE YOU DONT MIND, IT'S HERE FOR EASY RECOLLECTION

export const registerUser = async (req, res) => {
  try {

    const { error, value } = registerValidator.validate(req.body, { // Validate the request body using Joi
      abortEarly: false, 
    });

    if (error) {
      return res.status(400).json({
        errors: error.details.map((err) => err.message),
      });
    }

    const { username, email, password } = value; // Unpack (destructure) the validated user details from the "box" (value this makes it easier to use them without calling the value every time

    // Check if user already exists (with just the email)
    if (await User.findOne({ email })) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user with validated data
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    // Save the user to the database
    await newUser.save();

    // Return success message
    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    // Handle any unexpected errors
    res.status(500).json({ message: error.message });
  }
};


export const loginUser = async (req, res) => {
  try {
    const { error, value } = loginValidator.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return res.status(400).json({
        errors: error.details.map((err) => err.message),
      });
    }
    const { email, password } = value;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {  // Validate user and password by comparing
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Create a special token (like a magic key) for the user after login and proves their identity and expires in 2 hours for security
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Return the token and user details
    res.json({
      token,
      user: { id: user._id, username: user.username, email: user.email },
    });
  } catch (error) {
    // Handle unexpected errors
    res.status(500).json({ message: error.message });
  }
};



export const addExpense = async (req, res) => {
  try {
  
    const { error, value } = expenseValidator.validate(req.body, {
      abortEarly: false, // Ensures all validation errors are returned together and not one by one 
    });
    if (error) {
      return res.status(400).json({
        errors: error.details.map((err) => err.message),
      });
    }

    // Create a new expense entry using the validated data (value)
// helps fill the form with correct details before saving it
// Also, attach the logged-in user's ID to know who owns the expense
// Use optional chaining (?.) to safely get the user's ID
// This prevents errors if req.user is null
const expense = new Expenses({
  user: req.user?.id, // Assign the logged-in user's ID safely
  ...value, // Use validated values directly
});


    // Save the expense to the database
    const result = await expense.save();

    // Return a success response with the saved expense which is stored in result
    res.status(201).json(result);
  } catch (error) {
    // If an error occurs, return a 500 error with the error message
    res.status(500).json({ message: error.message });
  }
};



export const getExpenses = async (req, res, next) => {
  try {
    // Extract filter and sorting criteria from query parameters
    const { filter = "{}", sort = "{}" } = req.query;

    // Find expenses in the database using the filter and sort the results
    const expenses = await Expenses.find(JSON.parse(filter)).sort(JSON.parse(sort)
    );

    // Return the list of expenses
    res.json(expenses);
  } catch (error) {
    // If an error occurs, pass it to the middleware
    next(error);
  }
};


export const getExpenseById = async (req, res, next) => {
  try {
    // Find the expense by its ID
    const expense = await Expenses.findById(req.params.id);

    // If the expense is not found, return a 404 error
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    // If they found, return the expense details with the id they specified
    res.json(expense);
  } catch (error) {
    // If an error occurs, pass it to the error-handling middleware
    next(error);
  }
};



export const deleteExpense = async (req, res, next) => {
  try {
    // This code will get the  user's ID and find the expense Id too
    const userId = req.user.id;
    const expense = await Expenses.findById(req.params.id);

    // Check if expense exists and if it doesnt it returns it is not found
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    // because mongodb store id with objectId , we have to convert it to string before it compares it to the userId
    if (expense.user.toString() !== userId) {
      return res.status(403).json({ message: "Not authorized to delete this expense" });
    }

    // Delete the expense
    await expense.deleteOne();
    res.json({ message: "Expense deleted successfully" });
  } catch (error) {
    next(error);
  }
};

