import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle, Loader } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    const API = import.meta.env.VITE_API_URL;
    try {
      const response = await fetch(`${API}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Login failed");
      }

      const { token } = await response.json();
      localStorage.setItem("token", token);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 flex items-center justify-center p-4">
      
      {/* Ambient background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-600/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-md">
        
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-linear-to-br from-amber-600 to-amber-700 rounded-lg flex items-center justify-center mx-auto mb-4 text-white font-bold text-lg">
            ₹
          </div>
          <h1 className="text-3xl font-bold text-stone-100 mb-2">Expense Track</h1>
          <p className="text-stone-400">Track your spending wisely</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-stone-900/50 backdrop-blur-sm border border-stone-800/50 rounded-lg p-8 space-y-6">
          
          {error && (
            <div className="p-4 bg-red-600/20 border border-red-600/50 rounded-lg flex items-center gap-3 text-red-400 text-sm">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-stone-200 mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
              className="w-full px-4 py-3 bg-stone-800/50 border border-stone-700 rounded-lg text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-600 transition-colors"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-stone-200 mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              className="w-full px-4 py-3 bg-stone-800/50 border border-stone-700 rounded-lg text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-600 transition-colors"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-3 bg-gradient-to-br from-amber-600 to-amber-700 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-amber-600/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader size={18} className="animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-stone-700/50"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-stone-900/50 text-stone-500">New to Expense Track?</span>
            </div>
          </div>

          {/* Sign Up Link */}
          <button
            type="button"
            onClick={() => navigate("/signup")}
            className="w-full px-4 py-3 bg-stone-800 border border-stone-700 text-stone-100 rounded-lg font-medium hover:border-amber-600/50 transition-all"
          >
            Create Account
          </button>

        </form>

        {/* Footer Info */}
        <p className="text-center text-xs text-stone-500 mt-6">
          Demo credentials: demo@example.com / password123
        </p>

      </div>

    </div>
  );
}