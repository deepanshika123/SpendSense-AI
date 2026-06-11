import { useState, useEffect } from "react";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from "recharts";
import { TrendingDown, Calendar } from "lucide-react";

export default function Analytics() {
  const [timeRange, setTimeRange] = useState("month");
  const [data, setData] = useState({
    byCategory: [],
    byDay: [],
    comparison: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      const API = import.meta.env.VITE_API_URL;
      try {
        const response = await fetch(`${API}/api/expenses/analytics?range=${timeRange}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        const result = await response.json();
        console.log(result);
        setData(result);
      } catch (error) {
        console.error("Failed to fetch analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [timeRange]);

  const COLORS = ["#b45309", "#92400e", "#78350f", "#d97706", "#f59e0b", "#fbbf24", "#fcd34d"];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-stone-100 mb-2">Analytics</h1>
        <p className="text-stone-400">Detailed spending insights</p>
      </div>

      {/* Time Range Selector */}
      <div className="flex gap-2 flex-wrap">
        {["week", "month", "year"].map(range => (
          <button
            key={range}
            onClick={() => setTimeRange(range)}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
              timeRange === range
                ? "bg-amber-600 text-white shadow-lg shadow-amber-600/20"
                : "bg-stone-800 text-stone-300 hover:bg-stone-700"
            }`}
          >
            {range.charAt(0).toUpperCase() + range.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2].map(i => (
            <div key={i} className="h-80 bg-stone-800/30 rounded-lg animate-pulse"></div>
          ))}
        </div>
      ) : (
        <>
          
          {/* Charts Grid */}
          <div className="grid lg:grid-cols-2 gap-6">
            
            {/* Category Breakdown */}
            <div className="bg-stone-900/50 backdrop-blur-sm border border-stone-800/50 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingDown size={20} className="text-amber-600" />
                <h3 className="text-lg font-semibold text-stone-100">Spending by Category</h3>
              </div>
              
              {data.byCategory?.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={data.byCategory}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {data.byCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "#1c1917", 
                        border: "1px solid #292524",
                        borderRadius: "8px"
                      }}
                      formatter={(value) => `₹${value.toLocaleString()}`}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-64 flex items-center justify-center text-stone-500">
                  No data available
                </div>
              )}
            </div>

            {/* Daily Trend */}
            <div className="bg-stone-900/50 backdrop-blur-sm border border-stone-800/50 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <Calendar size={20} className="text-amber-600" />
                <h3 className="text-lg font-semibold text-stone-100">Daily Spending</h3>
              </div>

              {data.byDay?.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={data.byDay}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#292524" />
                    <XAxis dataKey="date" stroke="#78716e" style={{ fontSize: "12px" }} />
                    <YAxis stroke="#78716e" style={{ fontSize: "12px" }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "#1c1917", 
                        border: "1px solid #292524",
                        borderRadius: "8px"
                      }}
                      formatter={(value) => `₹${value.toLocaleString()}`}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="amount" 
                      stroke="#b45309" 
                      strokeWidth={2}
                      dot={{ fill: "#b45309", r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-64 flex items-center justify-center text-stone-500">
                  No data available
                </div>
              )}
            </div>

          </div>

          {/* Category Stats */}
          <div className="bg-stone-900/50 backdrop-blur-sm border border-stone-800/50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-stone-100 mb-4">Category Breakdown</h3>
            
            {data.byCategory?.length > 0 ? (
              <div className="space-y-3">
                {data.byCategory.map((cat, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                      />
                      <span className="text-stone-300 font-medium">{cat.name}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-amber-400 font-semibold">₹{cat.value.toLocaleString()}</p>
                      <p className="text-xs text-stone-500">
                        {data.byCategory.length > 0 
                          ? ((cat.value / data.byCategory.reduce((sum, c) => sum + c.value, 0)) * 100).toFixed(1)
                          : 0}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-stone-500 text-center py-8">No expenses yet</p>
            )}
          </div>

        </>
      )}

    </div>
  );
}