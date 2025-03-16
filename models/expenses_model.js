import { Schema, model } from "mongoose";
import normalize from "normalize-mongoose";

// I am doing the user schema first
const userSchema = new Schema({
    username: { type: String, required: true, unique: true},
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
}, { timestamps: true });

userSchema.plugin(normalize);

// Now I am doing the expenses schema
// I will need to add the user schema to the export statement
const expensesSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "User" },
    item: { type: String, required: true },
    amount: { type: Number, required: true },
    category: { type: String, required: true },
    payment: { type: String, required: true },
    notes: { type: String },
    description: { type: String },
    status: { type: String, required: true },
}, { timestamps: true });

expensesSchema.plugin(normalize);
export const User = model("User", userSchema);
export const Expenses = model("Expenses", expensesSchema); 



