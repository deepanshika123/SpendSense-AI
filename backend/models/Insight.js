// const mongoose = require("mongoose");

// const insightSchema = new mongoose.Schema(
//   {
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },

//     message: {
//       type: String,
//       required: true,
//     },

//     type: {
//       type: String,
//       enum: ["warning", "suggestion", "prediction"],
//       default: "suggestion",
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// module.exports = mongoose.model("Insight", insightSchema);




const mongoose = require("mongoose");

const insightSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // AI Generated Content
    summary: {
      title: String,
      message: String,
    },

    recommendations: [
      {
        title: String,
        description: String,
        impact: String,
      }
    ],

    topCategories: [
      {
        category: String,
        amount: Number,
      }
    ],

    metrics: {
      trend: Number,
      budgetUsage: Number,
    },

    // Tracking
    type: {
      type: String,
      enum: ["warning", "suggestion", "prediction"],
      default: "suggestion",
    },

    // IMPORTANT: When was this insight generated?
    generatedAt: {
      type: Date,
      default: Date.now,
    },

    // Which expense IDs were used to generate this?
    expenseCount: {
      type: Number,
      default: 0,
    },

    // Is this data still valid? (revalidate daily)
    isValid: {
      type: Boolean,
      default: true,
    }
  },
  {
    timestamps: true,
  }
);

// Auto-invalidate after 24 hours
insightSchema.index(
  { generatedAt: 1 },
  { expireAfterSeconds: 86400 } // 24 hours
);

module.exports = mongoose.model("Insight", insightSchema);