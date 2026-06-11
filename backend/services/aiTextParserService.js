// services/aiTextParserService.js

const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.parseReceiptText = async (text) => {

  try {

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
    });

    const prompt = `
    Extract expense information from this OCR receipt text.

    Return ONLY valid JSON.

    Required JSON format:

    {
      "merchant": "",
      "amount": 0,
      "category": "",
      "date": ""
    }

    Categories allowed:
    Food, Travel, Shopping, Bills, Education, Health, Entertainment, Other

    OCR Text:
    ${text}
    `;

    const result = await model.generateContent(prompt);

    const response = result.response.text();

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