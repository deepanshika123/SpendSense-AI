// controllers/expenseController.js

const Expense = require("../models/Expense");
const Insight = require("../models/Insight");

const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);




 
// ==========================================
// HELPER: Check if existing insight is valid
// ==========================================
const isInsightValid = (insight) => {
  if (!insight) return false;
  if (!insight.isValid) return false;
 
  // Check if insight is older than 24 hours
  const generatedTime = new Date(insight.generatedAt).getTime();
  const now = new Date().getTime();
  const hoursDiff = (now - generatedTime) / (1000 * 60 * 60);
 
  return hoursDiff < 24; // Valid if less than 24 hours old
};
 
// ==========================================
// HELPER: Generate AI Insights (CALL API)
// ==========================================
const generateAIInsights = async (expenses) => {
  try {
    const simplifiedExpenses = expenses.map((exp) => ({
      title: exp.title,
      amount: exp.amount,
      category: exp.category,
      date: exp.expenseDate,
    }));
 
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
    });
 
    const prompt = `
You are a smart financial advisor.
 
Analyze this expense data and return ONLY valid JSON.
 
Expense Data:
${JSON.stringify(simplifiedExpenses)}
 
Return EXACTLY this format (no markdown, no extra text):
{
  "summary": {
    "title": "Brief title",
    "message": "1-2 sentence summary of spending"
  },
  "recommendations": [
    {
      "title": "Recommendation title",
      "description": "Short description",
      "impact": "Expected impact like 'Save ₹500/month'"
    }
  ],
  "topCategories": [
    {
      "category": "Category name",
      "amount": number
    }
  ],
  "metrics": {
    "trend": -5,
    "budgetUsage": 65
  }
}
`;
 
    const result = await model.generateContent(prompt);
    const text = result.response.text();
 
    // Clean up response
    const cleaned = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();
 
    let parsed = JSON.parse(cleaned);
 
    return parsed;
  } catch (error) {
    console.log("AI Generation Failed:", error.message);
    return null;
  }
};
 
// ==========================================
// HELPER: Generate Fallback Insights (NO API)
// ==========================================
const generateFallbackInsights = (expenses) => {
  const categoryMap = {};
  let totalAmount = 0;
 
  expenses.forEach((exp) => {
    const category = exp.category || "Other";
    categoryMap[category] = (categoryMap[category] || 0) + Number(exp.amount);
    totalAmount += Number(exp.amount);
  });
 
  const topCategories = Object.entries(categoryMap)
    .map(([cat, amount]) => ({ category: cat, amount }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);
 
  const average = expenses.length > 0 ? Math.round(totalAmount / expenses.length) : 0;
 
  return {
    summary: {
      title: "💰 Spending Overview",
      message: `Total spent: ₹${totalAmount}. Average per expense: ₹${average}.`,
    },
    recommendations: [
      {
        title: "Track High Categories",
        description: `Focus on ${topCategories[0]?.category || 'spending'} where you spend the most.`,
        impact: "Save 10-15% monthly",
      },
      {
        title: "Set Weekly Budgets",
        description: "Divide monthly budget into weekly limits to control spending.",
        impact: "Better control",
      },
    ],
    topCategories,
    metrics: {
      trend: 5,
      budgetUsage: 65,
    },
  };
};
 
// ==========================================
// MAIN: Get AI Insights (Smart Caching)
// ==========================================
exports.getAIInsights = async (req, res) => {
  try {
    const userId = req.user._id;
 
    // Step 1: Check if recent insight exists in database
    console.log("📌 Checking cached insight...");
    
    let cachedInsight = await Insight.findOne({
      user: userId,
      isValid: true,
    }).sort({ generatedAt: -1 });
 
    if (cachedInsight && isInsightValid(cachedInsight)) {
      console.log("✅ Cache hit! Returning stored insight (No API call needed)");
      return res.status(200).json({
        ...cachedInsight.toObject(),
        fromCache: true,
        cacheAge: Math.round(
          (Date.now() - new Date(cachedInsight.generatedAt)) / (1000 * 60)
        ),
      });
    }
 
    console.log("❌ Cache miss. Fetching expenses...");
 
    // Step 2: Get all expenses
    const expenses = await Expense.find({ user: userId });
 
    if (!expenses.length) {
      return res.status(200).json({
        summary: {
          title: "No Expenses",
          message: "Add expenses to generate insights",
        },
        recommendations: [],
      });
    }
 
    // Step 3: Try AI Generation (Check quota first)
    console.log("🤖 Calling Gemini API...");
    
    let aiResult = await generateAIInsights(expenses);
 
    // Step 4: If AI fails, use fallback
    let finalInsight = aiResult || generateFallbackInsights(expenses);
 
    // Step 5: Save to database (for future cache)
    console.log("💾 Saving insight to database...");
    
    const newInsight = await Insight.create({
      user: userId,
      summary: finalInsight.summary,
      recommendations: finalInsight.recommendations,
      topCategories: finalInsight.topCategories,
      metrics: finalInsight.metrics,
      expenseCount: expenses.length,
      isValid: true,
    });
 
    // Return response
    res.status(200).json({
      ...finalInsight,
      fromCache: false,
      fromAI: !!aiResult,
      message: !aiResult 
        ? "Using offline analysis (API quota limited)" 
        : "Generated with AI",
    });
 
  } catch (error) {
    console.log("Error in getAIInsights:", error.message);
 
    // Ultimate fallback - return basic stats
    try {
      const expenses = await Expense.find({ user: req.user._id });
      const fallback = generateFallbackInsights(expenses);
      
      res.status(200).json({
        ...fallback,
        error: "Using fallback analysis",
      });
    } catch {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
};
 
// ==========================================
// BONUS: Force Regenerate (Admin/User)
// ==========================================
exports.regenerateInsights = async (req, res) => {
  try {
    const userId = req.user._id;
 
    // Mark old insights as invalid
    await Insight.updateMany(
      { user: userId },
      { isValid: false }
    );
 
    console.log("🔄 Invalidated old insights, generating new...");
 
    // Get expenses and generate
    const expenses = await Expense.find({ user: userId });
 
    if (!expenses.length) {
      return res.status(200).json({
        message: "No expenses to analyze",
      });
    }
 
    const aiResult = await generateAIInsights(expenses);
    const finalInsight = aiResult || generateFallbackInsights(expenses);
 
    // Save new insight
    const newInsight = await Insight.create({
      user: userId,
      summary: finalInsight.summary,
      recommendations: finalInsight.recommendations,
      topCategories: finalInsight.topCategories,
      metrics: finalInsight.metrics,
      expenseCount: expenses.length,
      isValid: true,
    });
 
    res.status(200).json({
      success: true,
      message: "Insights regenerated successfully",
      ...finalInsight,
      fromAI: !!aiResult,
    });
 
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
 

// ADD EXPENSE
exports.addExpense = async (req, res) => {
  try {
    const { title, amount, category, paymentMethod, description, date } =
      req.body;

    const expense = await Expense.create({
      user: req.user?.id || req.user?._id,
      title,
      amount,
      category,
      paymentMethod,
      note: description,
      expenseDate: date || new Date(),
    });

    res.status(201).json({
      success: true,
      expense,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET ALL EXPENSES
exports.getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({
      user: req.user._id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: expenses.length,
      expenses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET SINGLE EXPENSE
exports.getSingleExpense = async (req, res) => {
  try {
    const expense = await Expense.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

    res.status(200).json({
      success: true,
      expense,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// UPDATE EXPENSE
exports.updateExpense = async (req, res) => {
  try {
    const expense = await Expense.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user._id,
      },
      req.body,
      {
        new: true,
      },
    );

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

    res.status(200).json({
      success: true,
      expense,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE EXPENSE
exports.deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Expense deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getAnalytics = async (req, res) => {
  try {
    const Expense = require("../models/Expense");

    const expenses = await Expense.find({
      user: req.user._id,
    });

    // -----------------------
    // CATEGORY DATA
    // -----------------------

    const categoryMap = {};

    expenses.forEach((expense) => {
      const category = expense.category || "Other";

      if (!categoryMap[category]) {
        categoryMap[category] = 0;
      }

      categoryMap[category] += Number(expense.amount);
    });

    const byCategory = Object.keys(categoryMap).map((key) => ({
      name: key,
      value: categoryMap[key],
    }));

    // -----------------------
    // DAILY DATA
    // -----------------------

    const dayMap = {};

    expenses.forEach((exp) => {
      // SAFE DATE
      const rawDate = exp.expenseDate;

      if (!rawDate) return;

      const date = new Date(rawDate).toISOString().split("T")[0];

      if (!dayMap[date]) {
        dayMap[date] = 0;
      }

      dayMap[date] += Number(exp.amount);
    });

    const byDay = Object.keys(dayMap).map((key) => ({
      date: key,
      amount: dayMap[key],
    }));

    return res.status(200).json({
      byCategory,
      byDay,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};







