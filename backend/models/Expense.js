// models/Expense.js

const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    category: {
      type: String,
      enum: [
        "Food",
        "Travel",
        "Shopping",
        "Bills",
        "Entertainment",
        "Health",
        "Education",
        "Other",
      ],
      default: "Other",
    },

    paymentMethod: {
      type: String,
      enum: ["Cash", "Card", "UPI", "Other"],
      default: "UPI",
    },

    note: {
      type: String,
      default: "",
    },

    receiptImage: {
      type: String,
      default: "",
    },

    isRecurring: {
      type: Boolean,
      default: false,
    },

    expenseDate: {
      type: Date,
      default: Date.now,
    },

    aiGenerated: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Expense", expenseSchema);