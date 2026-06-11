const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.parseVoiceExpense = async (req, res) => {

  try {

    console.log("VOICE ROUTE HIT");

    const { text } = req.body;

    console.log("TEXT:", text);

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
    });

    const prompt = `
Extract expense data from this voice input.

Return ONLY pure JSON.

{
  "title": "",
  "amount": 0,
  "category": "",
  "paymentMethod": ""
}

Voice:
"${text}"
`;

    console.log("CALLING GEMINI");

    const result = await model.generateContent(prompt);

    console.log("GEMINI RESPONSE RECEIVED");

    const response = result.response.text();

    console.log("RAW RESPONSE:", response);

    const clean = response
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    let parsed;

    try {

      parsed = JSON.parse(clean);

    } catch (err) {

      console.log("JSON PARSE FAILED");

      console.log(clean);

      return res.status(500).json({
        message: "Invalid JSON from Gemini",
      });
    }

    res.status(200).json(parsed);

  } catch (error) {

    console.log("FULL ERROR:");

    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};