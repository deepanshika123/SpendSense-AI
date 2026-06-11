import { useState, useRef } from "react";
import { Upload, X, AlertCircle, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function UploadReceipt() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [extractedData, setExtractedData] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    category: "Food",
    date: new Date().toISOString().split("T")[0],
    description: "",
  });

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB");
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result);
    };
    reader.readAsDataURL(file);

    // Send to backend for OCR
    await extractReceiptData(file);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";

    const parts = dateString.split(/[-/]/);

    if (parts.length !== 3) return "";

    let [day, month, year] = parts;

    if (year.length === 2) {
      year = "20" + year;
    }

    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  };

  const extractReceiptData = async (file) => {
    setLoading(true);
    setError("");

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("receipt", file);

      const API = import.meta.env.VITE_API_URL;
      const response = await fetch(`${API}/api/receipt/scan`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error("Failed to extract receipt data");
      }

      const data = await response.json();
      setExtractedData(data.parsedData);

      // Pre-fill form
      if (data.parsedData?.amount) {
        setFormData((prev) => ({
          ...prev,

          title: data.parsedData.merchant || "Receipt Purchase",

          amount: data.parsedData.amount.toString(),

          category: data.parsedData?.category?.trim() || "Other",

          date: formatDate(data.parsedData.date) || prev.date,

          description: data.cleanedText?.slice(0, 200) || "",
        }));
      }
    } catch (err) {
      setError(err.message || "Failed to extract receipt data");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
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
        throw new Error("Failed to save expense");
      }

      setSuccess(true);
      setPreview(null);
      setExtractedData(null);
      setFormData({
        title: "",
        amount: "",
        category: "Food",
        date: new Date().toISOString().split("T")[0],
        description: "",
      });

      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <div className="max-w-3xl mx-auto animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-stone-100 mb-2">
          Upload Receipt
        </h1>
        <p className="text-stone-400">
          Scan your receipt and we'll extract the details
        </p>
      </div>

      {success && (
        <div className="mb-6 p-4 bg-green-600/20 border border-green-600/50 rounded-lg flex items-center gap-3 text-green-400 text-sm">
          <Check size={18} />
          Expense saved successfully
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-600/20 border border-red-600/50 rounded-lg flex items-center gap-3 text-red-400 text-sm">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Upload Area */}
        <div>
          <div
            onClick={() => fileInputRef.current?.click()}
            className="relative border-2 border-dashed border-stone-700 rounded-lg p-8 text-center cursor-pointer hover:border-amber-600/50 transition-colors group"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />

            {preview ? (
              <div className="relative">
                <img
                  src={preview}
                  alt="Receipt preview"
                  className="w-full rounded-lg max-h-96 object-cover"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setPreview(null);
                    setExtractedData(null);
                    fileInputRef.current = null;
                  }}
                  className="absolute top-2 right-2 bg-red-600/80 hover:bg-red-700 text-white p-2 rounded-full transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            ) : (
              <>
                <Upload className="w-12 h-12 text-amber-600/60 mx-auto mb-3 group-hover:text-amber-600 transition-colors" />
                <p className="text-stone-200 font-medium mb-1">
                  Click to upload receipt
                </p>
                <p className="text-xs text-stone-500">
                  PNG, JPG or PDF (max 5MB)
                </p>
              </>
            )}
          </div>

          {extractedData && (
            <div className="mt-6 bg-stone-900/50 border border-stone-800/50 rounded-lg p-4">
              <p className="text-sm font-medium text-stone-200 mb-3">
                Extracted Info:
              </p>
              <div className="space-y-2 text-sm">
                {extractedData.vendor && (
                  <p className="text-stone-300">
                    <span className="text-stone-500">Vendor:</span>{" "}
                    {extractedData.vendor}
                  </p>
                )}
                {extractedData.amount && (
                  <p className="text-amber-400 font-medium">
                    Amount: ₹{extractedData.amount}
                  </p>
                )}
                {extractedData.date && (
                  <p className="text-stone-300">
                    <span className="text-stone-500">Date:</span>{" "}
                    {extractedData.date}
                  </p>
                )}
                {extractedData.items?.length > 0 && (
                  <div>
                    <p className="text-stone-500 text-xs mb-1">Items:</p>
                    <ul className="text-stone-400 text-xs space-y-1">
                      {extractedData.items.slice(0, 3).map((item, i) => (
                        <li key={i}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Form */}
        {preview && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="bg-stone-900/50 backdrop-blur-sm border border-stone-800/50 rounded-lg p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-200 mb-2">
                  Title <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-stone-800/50 border border-stone-700 rounded-lg text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-600 transition-colors text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-200 mb-2">
                  Amount <span className="text-red-400">*</span>
                </label>
                <div className="flex items-center">
                  <span className="text-stone-400 mr-2">₹</span>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    className="flex-1 px-4 py-3 bg-stone-800/50 border border-stone-700 rounded-lg text-stone-100 focus:outline-none focus:border-amber-600 transition-colors text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-200 mb-2">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-stone-800/50 border border-stone-700 rounded-lg text-stone-100 focus:outline-none focus:border-amber-600 transition-colors appearance-none cursor-pointer text-sm"
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

              <div>
                <label className="block text-sm font-medium text-stone-200 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-stone-800/50 border border-stone-700 rounded-lg text-stone-100 focus:outline-none focus:border-amber-600 transition-colors text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-200 mb-2">
                  Notes
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-4 py-3 bg-stone-800/50 border border-stone-700 rounded-lg text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-600 transition-colors resize-none text-sm"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 px-4 py-3 bg-stone-800 border border-stone-700 text-stone-100 rounded-lg font-medium text-sm hover:border-stone-600 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-3 bg-linear-to-br from-amber-600 to-amber-700 text-white rounded-lg font-medium text-sm hover:shadow-lg hover:shadow-amber-600/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Saving..." : "Save Expense"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
