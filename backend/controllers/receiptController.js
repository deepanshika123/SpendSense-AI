
const { extractTextFromImage } = require("../services/ocrService");

const { cleanOCRText } = require("../utils/cleanOCRText");

const { parseReceiptText } = require("../services/aiTextParserService");

const { parseExpenseData } = require("../services/expenseParserService");

exports.scanReceipt = async (req, res) => {
  try {

    console.log("FILE:", req.file);

    // FILE CHECK
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Receipt image required",
      });
    }

    // CLOUDINARY URL
    const imageUrl = req.file.path;

    console.log("IMAGE URL:", imageUrl);

    // STEP 1 OCR
    const rawText = await extractTextFromImage(imageUrl);

    console.log("RAW OCR TEXT:");
    console.log(rawText);

    // STEP 2 CLEAN
    const cleanedText = cleanOCRText(rawText);

    // STEP 3 PARSE
    let parsedData = parseExpenseData(cleanedText);

    // STEP 4 AI FALLBACK
    const lowConfidence =
      !parsedData.amount ||
      parsedData.amount === 0 ||
      parsedData.merchant === "Unknown";

    // if (lowConfidence) {
    //   try {
    //     parsedData = await parseReceiptText(cleanedText);
    //   } catch (err) {
    //     console.log("AI failed → fallback used");
    //   }
    // }

    if (lowConfidence) {
  try {
    const aiData = await parseReceiptText(cleanedText);

    parsedData = {
      merchant: aiData.merchant || parsedData.merchant,
      amount: aiData.amount || parsedData.amount,
      category: aiData.category || parsedData.category,
      date: aiData.date || parsedData.date,
    };

  } catch (err) {
    console.log("AI failed → fallback used");
  }
}

    // RESPONSE
    return res.status(200).json({
      success: true,
      cleanedText,
      parsedData,
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};