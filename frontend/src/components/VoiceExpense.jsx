import { Mic } from "lucide-react";

export default function VoiceExpense({ setFormData }) {

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

      console.log(text);

      parseVoiceExpense(text);
    };

    recognition.start();
  };

  const parseVoiceExpense = (text) => {

    const lower = text.toLowerCase();

    // Amount
    const amountMatch = lower.match(/\d+/);

    const amount = amountMatch ? amountMatch[0] : "";

    // Category
    let category = "Other";

    if (lower.includes("pizza") || lower.includes("food")) {
      category = "Food";
    }

    if (lower.includes("uber") || lower.includes("travel")) {
      category = "Travel";
    }

    // Payment
    let paymentMethod = "Cash";

    if (lower.includes("upi")) {
      paymentMethod = "UPI";
    }

    if (lower.includes("card")) {
      paymentMethod = "Card";
    }

    setFormData(prev => ({
      ...prev,
      title: text,
      amount,
      category,
      paymentMethod
    }));
  };

  return (
    <button
      type="button"
      onClick={startListening}
      className="flex items-center gap-2 px-4 py-3 bg-amber-600 text-white rounded-lg"
    >
      <Mic size={18} />
      Voice Entry
    </button>
  );
}