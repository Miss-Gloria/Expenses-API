import express from "express";
import mongoose from "mongoose";
import expensesRouter from "./routers/expenses_route.js";
import cors from "cors";

await mongoose.connect(process.env.MONGO_URL);
console.log("Database connected successfully");

const app = express();
app.use(express.json());
app.use(cors()); 
app.use(expensesRouter);

const port = process.env.PORT || 3400;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
