import { useState } from "react";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import VoiceExpense from "../components/VoiceExpense";

export default function AddExpense() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    category: "Food",
    date: new Date().toISOString().split("T")[0],
    description: "",
    paymentMethod: "Cash",
  });

  const categories = [
    { value: "Food", label: "🍔 Food & Dining" },
    { value: "Travel", label: "🚗 Travel" },
    { value: "Entertainment", label: "🎬 Entertainment" },
    { value: "Bills", label: "💡 Bills" },
    { value: "Shopping", label: "🛍️ Shopping" },
    { value: "Health", label: "🏥 Health" },
    { value: "Education", label: "📚 Education" },
    { value: "Other", label: "📌 Other" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Validate
      if (!formData.title || !formData.amount) {
        setError("Title and amount are required");
        setLoading(false);
        return;
      }

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
        throw new Error("Failed to add expense");
      }

      setSuccess(true);
      setFormData({
        title: "",
        amount: "",
        category: "Food",
        date: new Date().toISOString().split("T")[0],
        description: "",
        paymentMethod: "Cash",
      });

      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto animate-in fade-in duration-500">
      {/* Header */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-stone-400 hover:text-stone-200 mb-8 transition-colors"
      >
        <ArrowLeft size={20} />
        <span>Back</span>
      </button>

      <div className="mb-8">
        <h1 className="text-4xl font-bold text-stone-100 mb-2">Add Expense</h1>
        <p className="text-stone-400">Record a new expense</p>
      </div>

      {/* Success Message */}
      {success && (
        <div className="mb-6 p-4 bg-green-600/20 border border-green-600/50 rounded-lg text-green-400 text-sm">
          ✓ Expense added successfully
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-600/20 border border-red-600/50 rounded-lg flex items-center gap-3 text-red-400 text-sm">
          <AlertCircle size={18} />
          {error}
        </div>
      )}
      <VoiceExpense setFormData={setFormData} />
      
      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-stone-900/50 backdrop-blur-sm border border-stone-800/50 rounded-lg p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-stone-200 mb-2">
              Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Lunch at cafe"
              className="w-full px-4 py-3 bg-stone-800/50 border border-stone-700 rounded-lg text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-600 transition-colors"
            />
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-stone-200 mb-2">
              Amount <span className="text-red-400">*</span>
            </label>
            <div className="flex items-center">
              <span className="text-stone-400 mr-2 text-lg">₹</span>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="0.00"
                step="0.01"
                min="0"
                className="flex-1 px-4 py-3 bg-stone-800/50 border border-stone-700 rounded-lg text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-600 transition-colors"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-stone-200 mb-2">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-stone-800/50 border border-stone-700 rounded-lg text-stone-100 focus:outline-none focus:border-amber-600 transition-colors appearance-none cursor-pointer"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23a8a29e' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 12px center",
                paddingRight: "36px",
              }}
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-stone-200 mb-2">
              Date
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-stone-800/50 border border-stone-700 rounded-lg text-stone-100 focus:outline-none focus:border-amber-600 transition-colors"
            />
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-sm font-medium text-stone-200 mb-2">
              Payment Method
            </label>
            <div className="flex gap-3">
              {["Cash", "Card", "UPI", "Other"].map((method) => (
                <label
                  key={method}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method}
                    checked={formData.paymentMethod === method}
                    onChange={handleChange}
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-stone-300 capitalize">
                    {method}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-stone-200 mb-2">
              Notes (Optional)
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Add any details..."
              rows="4"
              className="w-full px-4 py-3 bg-stone-800/50 border border-stone-700 rounded-lg text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-600 transition-colors resize-none"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex-1 px-4 py-3 bg-stone-800 border border-stone-700 text-stone-100 rounded-lg font-medium hover:border-stone-600 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-4 py-3 bg-linear-to-br from-amber-600 to-amber-700 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-amber-600/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Adding..." : "Add Expense"}
          </button>
        </div>
      </form>
    </div>
  );
}
