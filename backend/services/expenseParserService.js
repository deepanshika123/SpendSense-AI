// services/expenseParserService.js

exports.parseExpenseData = (text) => {
  const lowerText = text.toLowerCase();

  // -----------------------
  // CATEGORY DETECTION
  // -----------------------

  let category = "Other";

  if (
    lowerText.includes("university") ||
    lowerText.includes("college") ||
    lowerText.includes("fees") ||
    lowerText.includes("semester")
  ) {
    category = "Education";
  } else if (
    lowerText.includes("pizza") ||
    lowerText.includes("restaurant") ||
    lowerText.includes("food")
  ) {
    category = "Food";
  } else if (
    lowerText.includes("uber") ||
    lowerText.includes("ola") ||
    lowerText.includes("travel")
  ) {
    category = "Travel";
  }

  // -----------------------
  // MERCHANT DETECTION
  // -----------------------

  let merchant = "Unknown";

  if (lowerText.includes("university institute of technology")) {
    merchant = "University Institute of Technology";
  }

  // -----------------------
  // AMOUNT DETECTION
  // -----------------------

  // -----------------------
  // AMOUNT DETECTION
  // -----------------------

  let amount = 0;

  // Try keyword-based extraction first
  const amountPatterns = [
    /total fee(?:\s\w+){0,5}\s(\d+)/i,

    /fee paid(?:\s\w+){0,5}\s(\d+)/i,

    /amount(?:\s\w+){0,5}\s(\d+)/i,

    /paid(?:\s\w+){0,5}\s(\d+)/i,

    /rs\.?\s?(\d+)/i,
  ];

  for (const pattern of amountPatterns) {
    const match = text.match(pattern);

    if (match && match[1]) {
      amount = Number(match[1]);

      break;
    }
  }

  // Fallback
  if (!amount) {
    const numbers = text.match(/\d+/g);

    if (numbers) {
      const validNumbers = numbers
        .map(Number)
        .filter((num) => num > 100 && num < 100000);

      if (validNumbers.length > 0) {
        amount = Math.max(...validNumbers);
      }
    }
  }

  // -----------------------
  // DATE DETECTION
  // -----------------------

  let date = "";

  // Standard formats
  const datePatterns = [
    /\b\d{1,2}[/-]\d{1,2}[/-]\d{2,4}\b/,

    /\b\d{1,2}\s\w+\s\d{4}\b/,
  ];

  for (const pattern of datePatterns) {
    const match = text.match(pattern);

    if (match) {
      date = match[0];

      break;
    }
  }

  // OCR fallback logic
  if (!date) {
    const paymentLine = text.match(
      /(payment|date|bate)(.*?)(\d{1,2}.*?\d{4})/i,
    );

    if (paymentLine) {
      date = paymentLine[3];
    }
  }

  return {
    merchant,
    amount,
    category,
    date,
  };
};
