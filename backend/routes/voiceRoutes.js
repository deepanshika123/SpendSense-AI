const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
  parseVoiceExpense,
} = require("../controllers/voiceController");

router.post("/parse", protect, parseVoiceExpense);

module.exports = router;