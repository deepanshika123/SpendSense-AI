const express = require("express");
const upload = require("../middleware/uploadMiddleware");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const { scanReceipt } = require("../controllers/receiptController");

router.post("/scan", protect, upload.single("receipt"), scanReceipt);

module.exports = router;