import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function VoiceExpensePage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    category: "Other",
    paymentMethod: "Cash",
    date: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    startListening();
  }, []);

  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition not supported");
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;

      parseVoiceExpense(text);
    };

    recognition.start();
  };

  const parseVoiceExpense = async (text) => {

  const lower = text.toLowerCase();

  // -------------------------
  // AMOUNT
  // -------------------------

  const amountMatch =
    lower.match(/₹?\s?(\d+)/) ||
    lower.match(/(\d+)\s?rupees/);

  const amount = amountMatch
    ? Number(amountMatch[1])
    : "";

  // -------------------------
  // PAYMENT METHOD
  // -------------------------

  let paymentMethod = "Cash";

  if (
    lower.includes("upi") ||
    lower.includes("gpay") ||
    lower.includes("phonepe") ||
    lower.includes("paytm")
  ) {
    paymentMethod = "UPI";
  }

  else if (
    lower.includes("card") ||
    lower.includes("credit card") ||
    lower.includes("debit card")
  ) {
    paymentMethod = "Card";
  }

  // -------------------------
  // CATEGORY KEYWORDS
  // -------------------------

  const categoryKeywords = {

    Food: [
      "pizza",
      "burger",
      "restaurant",
      "food",
      "cafe",
      "coffee",
      "zomato",
      "swiggy",
      "dinner",
      "lunch",
      "breakfast"
    ],

    Travel: [
      "uber",
      "ola",
      "metro",
      "fuel",
      "petrol",
      "diesel",
      "travel",
      "flight",
      "bus"
    ],

    Shopping: [
      "amazon",
      "flipkart",
      "shopping",
      "clothes",
      "nike",
      "zudio",
      "mall"
    ],

    Entertainment: [
      "movie",
      "netflix",
      "spotify",
      "hotstar",
      "game"
    ],

    Education: [
      "fees",
      "college",
      "course",
      "book",
      "university",
      "exam"
    ],

    Health: [
      "hospital",
      "medicine",
      "doctor",
      "pharmacy"
    ],

    Bills: [
      "electricity",
      "wifi",
      "internet",
      "bill",
      "recharge"
    ]
  };

  // -------------------------
  // CATEGORY DETECTION
  // -------------------------

  let category = "Other";

  for (const key in categoryKeywords) {

    const found = categoryKeywords[key].some(word =>
      lower.includes(word)
    );

    if (found) {
      category = key;
      break;
    }
  }

  // -------------------------
  // SMART TITLE EXTRACTION
  // -------------------------

  let title = lower;

  // Remove common filler words
  const removeWords = [
    "paid",
    "spent",
    "using",
    "for",
    "via",
    "through",
    "rs",
    "rupees",
    "upi",
    "cash",
    "card",
    "credit",
    "debit"
  ];

  removeWords.forEach(word => {

    const regex = new RegExp(`\\b${word}\\b`, "gi");

    title = title.replace(regex, "");
  });

  // Remove numbers
  title = title.replace(/\d+/g, "");

  // Remove extra spaces
  title = title.replace(/\s+/g, " ").trim();

  // Capitalize nicely
  title = title
    .split(" ")
    .map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join(" ");

  // -------------------------
  // LOW CONFIDENCE AI FALLBACK
  // -------------------------

  const lowConfidence =
    !amount ||
    category === "Other" ||
    title.length < 3;

  if (lowConfidence) {

    try {

      const API = import.meta.env.VITE_API_URL;

      const response = await fetch(`${API}/api/voice/parse`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ text })
      });

      if (response.ok) {

        const aiData = await response.json();

        setFormData(prev => ({
          ...prev,
          title: aiData.title || title,
          amount: aiData.amount || amount,
          category: aiData.category || category,
          paymentMethod:
            aiData.paymentMethod || paymentMethod
        }));

        return;
      }

    } catch (err) {

      console.log("AI fallback failed");
    }
  }

  // -------------------------
  // LOCAL RESULT
  // -------------------------

  setFormData(prev => ({
    ...prev,
    title,
    amount,
    category,
    paymentMethod
  }));
};



  const saveExpense = async () => {
    try {
      const API = import.meta.env.VITE_API_URL;

      const response = await fetch(`${API}/api/expenses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed");
      }

      alert("Expense Added");

      navigate("/");
    } catch (err) {
      alert("Failed to save expense");
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-stone-100">Voice Expense Entry</h1>

      <div className="bg-stone-900 border border-stone-800 rounded-lg p-6 space-y-4">
        <p className="text-stone-300">Speak something like:</p>

        <div className="text-amber-400">
          "Paid 500 rupees for pizza using UPI"
        </div>

        <button
          onClick={startListening}
          className="w-full bg-amber-600 text-white py-3 rounded-lg"
        >
          🎤 Start Listening
        </button>

        <div className="space-y-2 text-stone-300">
          <p>
            <b>Title:</b> {formData.title}
          </p>
          <p>
            <b>Amount:</b> ₹{formData.amount}
          </p>
          <p>
            <b>Category:</b> {formData.category}
          </p>
          <p>
            <b>Payment:</b> {formData.paymentMethod}
          </p>
        </div>

        <button
          onClick={saveExpense}
          className="w-full bg-green-600 text-white py-3 rounded-lg"
        >
          Save Expense
        </button>
      </div>
    </div>
  );
}
