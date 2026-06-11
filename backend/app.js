const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const compression = require("compression");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/authRoutes");
const testRoutes = require("./routes/testRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const receiptRoutes = require("./routes/receiptRoutes");
const voiceRoutes = require("./routes/voiceRoutes");
const userRoutes = require("./routes/userRoutes")
const app = express();

// Middlewares
app.use(cors({
  origin: ["http://localhost:5173",
    "https://spend-sense-ai-alpha.vercel.app"
  ],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet());
app.use(morgan("dev"));
app.use(compression());

// Test Route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "AI Expense Tracker API Running",
  });
});

// routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/test", testRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/receipt", receiptRoutes);
app.use("/api/voice", voiceRoutes);

module.exports = app;