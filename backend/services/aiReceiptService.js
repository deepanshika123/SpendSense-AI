// services/aiReceiptService.js

const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.extractReceiptData = async (imageUrl) => {

  try {

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
    });

    const prompt = `
    Analyze this expense receipt image and return ONLY valid JSON.

    Extract:
    - merchant
    - amount
    - category
    - date

    Categories can be:
    Food, Travel, Shopping, Bills, Entertainment, Health, Education, Other

    Return format:
    {
      "merchant": "",
      "amount": 0,
      "category": "",
      "date": ""
    }

    Receipt Image:
    ${imageUrl}
    `;

    const result = await model.generateContent(prompt);

    const response = result.response.text();

    // Remove markdown formatting if exists
    const cleanResponse = response
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(cleanResponse);

  } catch (error) {

    console.log(error);

    return {
      merchant: "",
      amount: 0,
      category: "Other",
      date: "",
    };
  }
};