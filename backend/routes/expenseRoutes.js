// routes/expenseRoutes.js

const express = require("express");

const {
  addExpense,
  getExpenses,
  getSingleExpense,
  updateExpense,
  deleteExpense,
  getAnalytics,
  getAIInsights,
   regenerateInsights,
} = require("../controllers/expenseController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, addExpense);

router.get("/", protect, getExpenses);
router.get("/analytics", protect, getAnalytics);
router.get("/insights", protect, getAIInsights);

router.post("/insights/regenerate", protect, regenerateInsights);

router.get("/:id", protect, getSingleExpense);

router.put("/:id", protect, updateExpense);

router.delete("/:id", protect, deleteExpense);

module.exports = router;