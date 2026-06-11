import { ArrowDownRight, ArrowUpRight, TrendingUp } from "lucide-react";
import { useState, useEffect } from "react";

export default function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [stats, setStats] = useState({ total: 0, thisMonth: 0, average: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch from backend
    const fetchDashboardData = async () => {
      const API = import.meta.env.VITE_API_URL;
      try {
        const response = await fetch(`${API}/api/expenses/`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const data = await response.json();
        const expenseList = data.expenses || [];

        setExpenses(expenseList);

        const total = expenseList.reduce((sum, item) => sum + item.amount, 0);

        const thisMonth = expenseList
          .filter((item) => {
            const d = new Date(item.expenseDate);
            const now = new Date();

            return (
              d.getMonth() === now.getMonth() &&
              d.getFullYear() === now.getFullYear()
            );
          })
          .reduce((sum, item) => sum + item.amount, 0);

        const average =
          expenseList.length > 0 ? Math.round(total / expenseList.length) : 0;

        setStats({
          total,
          thisMonth,
          average,
        });
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const categoryEmoji = {
    Food: "🍔",
    Travel: "🚗",
    Entertainment: "🎬",
    Bills: "💡",
    Shopping: "🛍️",
    Health: "🏥",
    Education: "📚",
    Other: "📌",
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-stone-100 mb-2">Dashboard</h1>
        <p className="text-stone-400">Track your spending at a glance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Spent */}
        <div className="bg-stone-900/50 backdrop-blur-sm border border-stone-800/50 rounded-lg p-6 hover:border-amber-600/30 transition-all group">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-stone-400 text-sm mb-1">Total Spent</p>
              <h2 className="text-3xl font-bold text-stone-100">
                ₹{stats.total.toLocaleString()}
              </h2>
            </div>
            <div className="w-10 h-10 bg-red-600/20 rounded-lg flex items-center justify-center text-red-400 group-hover:bg-red-600/30 transition-colors">
              <ArrowDownRight size={20} />
            </div>
          </div>
          <p className="text-xs text-stone-500">All time</p>
        </div>

        {/* This Month */}
        <div className="bg-stone-900/50 backdrop-blur-sm border border-stone-800/50 rounded-lg p-6 hover:border-amber-600/30 transition-all group">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-stone-400 text-sm mb-1">This Month</p>
              <h2 className="text-3xl font-bold text-stone-100">
                ₹{stats.thisMonth.toLocaleString()}
              </h2>
            </div>
            <div className="w-10 h-10 bg-amber-600/20 rounded-lg flex items-center justify-center text-amber-400 group-hover:bg-amber-600/30 transition-colors">
              <TrendingUp size={20} />
            </div>
          </div>
          <p className="text-xs text-stone-500">Current period</p>
        </div>

        {/* Average */}
        <div className="bg-stone-900/50 backdrop-blur-sm border border-stone-800/50 rounded-lg p-6 hover:border-amber-600/30 transition-all group">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-stone-400 text-sm mb-1">Daily Average</p>
              <h2 className="text-3xl font-bold text-stone-100">
                ₹{stats.average.toLocaleString()}
              </h2>
            </div>
            <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center text-blue-400 group-hover:bg-blue-600/30 transition-colors">
              <ArrowUpRight size={20} />
            </div>
          </div>
          <p className="text-xs text-stone-500">Per day average</p>
        </div>
      </div>

      {/* Recent Expenses */}
      <div className="bg-stone-900/50 backdrop-blur-sm border border-stone-800/50 rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-stone-100">
            Recent Expenses
          </h3>
          <a
            href="/add"
            className="text-amber-600 hover:text-amber-500 text-sm font-medium transition-colors"
          >
            Add new →
          </a>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-16 bg-stone-800/30 rounded animate-pulse"
              ></div>
            ))}
          </div>
        ) : expenses.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-stone-400 mb-4">No expenses yet</p>
            <a
              href="/add"
              className="inline-block bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-amber-700 transition-colors"
            >
              Add your first expense
            </a>
          </div>
        ) : (
          <div className="space-y-2">
            {expenses.slice(0, 5).map((expense, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-4 bg-stone-800/20 rounded-lg hover:bg-stone-800/40 transition-colors group"
              >
                <div className="flex items-center gap-4 flex-1">
                  <span className="text-2xl">
                    {categoryEmoji[expense.category] || "📌"}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-stone-100 font-medium truncate">
                      {expense.title}
                    </p>
                    <p className="text-xs text-stone-500">
                      {new Date(expense.expenseDate).toLocaleDateString(
                        "en-IN",
                        {
                          day: "numeric",
                          month: "short",
                        },
                      )}
                    </p>
                  </div>
                </div>
                <p className="text-amber-400 font-semibold ml-4">
                  ₹{expense.amount.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <a
          href="/add"
          className="bg-linear-to-br from-amber-600 to-amber-700 text-white rounded-lg p-4 font-medium hover:shadow-lg hover:shadow-amber-600/20 transition-all group"
        >
          <div className="flex items-center gap-3">
            <span className="text-xl">+</span>
            <span>Add Expense</span>
          </div>
        </a>
        <a
          href="/upload"
          className="bg-stone-800 border border-stone-700 text-stone-100 rounded-lg p-4 font-medium hover:border-amber-600/50 transition-all group"
        >
          <div className="flex items-center gap-3">
            <span className="text-xl">📸</span>
            <span>Upload Receipt</span>
          </div>
        </a>

        <a
          href="/voice"
          className="bg-stone-800 border border-stone-700 text-stone-100 rounded-lg p-4 font-medium hover:border-amber-600/50 transition-all group"
        >
          <div className="flex items-center gap-3">
            <span className="text-xl">🎤</span>
            <span>Voice Entry</span>
          </div>
        </a>
      </div>
    </div>
  );
}
