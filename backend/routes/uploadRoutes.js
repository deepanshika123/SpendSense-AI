const express = require("express");

const router = express.Router();

const upload = require("../middleware/uploadMiddleware");

const { protect } = require("../middleware/authMiddleware");

router.post(
  "/receipt",
  protect,
  upload.single("receipt"),
  (req, res) => {

    res.status(200).json({
      success: true,
      imageUrl: req.file.path,
    });

  }
);

module.exports = router;