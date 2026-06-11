// import { useState, useEffect } from "react";
// import { Sparkles, AlertCircle, TrendingUp, Target } from "lucide-react";

// export default function AIInsights() {
//   const [insights, setInsights] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const fetchInsights = async () => {
//     setLoading(true);

//     try {
//       const API = import.meta.env.VITE_API_URL;

//       const response = await fetch(`${API}/api/expenses/insights`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       });

//       if (!response.ok) {
//         throw new Error("Failed to fetch insights");
//       }

//       const data = await response.json();

//       console.log(data);

//       setInsights(data);
//     } catch (err) {
//       console.log(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="space-y-6 animate-in fade-in duration-500">
//       {/* Header */}
//       <div className="mb-8">
//         <h1 className="text-4xl font-bold text-stone-100 mb-2">AI Insights</h1>
//         <p className="text-stone-400">
//           Personalized spending recommendations powered by AI
//         </p>
//       </div>

//       <div className="flex gap-3 mt-4">
//         <button
//           onClick={fetchInsights}
//           className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg font-medium transition"
//         >
//           Generate AI Insights
//         </button>
//       </div>

//       {error && (
//         <div className="p-4 bg-red-600/20 border border-red-600/50 rounded-lg flex items-center gap-3 text-red-400 text-sm">
//           <AlertCircle size={18} />
//           {error}
//         </div>
//       )}

//       {loading ? (
//         <div className="space-y-4">
//           {[1, 2, 3].map((i) => (
//             <div
//               key={i}
//               className="h-24 bg-stone-800/30 rounded-lg animate-pulse"
//             ></div>
//           ))}
//         </div>
//       ) : insights ? (
//         <>
//           {/* Summary Card */}
//           <div className="bg-linear-to-br from-amber-600/20 to-amber-700/10 border border-amber-600/30 rounded-lg p-6 backdrop-blur-sm">
//             <div className="flex items-start gap-4">
//               <div className="w-12 h-12 bg-amber-600/20 rounded-lg flex items-center justify-center shrink-0">
//                 <Sparkles className="text-amber-400" size={24} />
//               </div>
//               <div>
//                 <h3 className="text-lg font-semibold text-stone-100 mb-2">
//                   {insights.summary?.title || "Spending Summary"}
//                 </h3>
//                 <p className="text-stone-300">
//                   {insights.summary?.message ||
//                     "Analyzing your spending patterns..."}
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Key Metrics
//           {insights.metrics && (
//             <div className="grid sm:grid-cols-2 gap-4">
//               <div className="bg-stone-900/50 border border-stone-800/50 rounded-lg p-4">
//                 <p className="text-stone-400 text-sm mb-2">Spending Trend</p>
//                 <div className="flex items-end gap-3">
//                   <span className="text-2xl font-bold text-stone-100">
//                     {insights.metrics.trend}%
//                   </span>
//                   <div
//                     className={`px-2 py-1 rounded text-xs font-medium ${
//                       insights.metrics.trend > 0
//                         ? "bg-red-600/20 text-red-400"
//                         : "bg-green-600/20 text-green-400"
//                     }`}
//                   >
//                     {insights.metrics.trend > 0
//                       ? "↑ Increasing"
//                       : "↓ Decreasing"}
//                   </div>
//                 </div>
//               </div>

//               <div className="bg-stone-900/50 border border-stone-800/50 rounded-lg p-4">
//                 <p className="text-stone-400 text-sm mb-2">Budget Status</p>
//                 <div className="flex items-end gap-3">
//                   <span className="text-2xl font-bold text-stone-100">
//                     {insights.metrics.budgetUsage || 0}%
//                   </span>
//                   <span className="text-stone-400 text-xs">of budget used</span>
//                 </div>
//               </div>
//             </div>
//           )} */}

//           {/* Recommendations */}
//           {insights.recommendations && insights.recommendations.length > 0 && (
//             <div>
//               <div className="flex items-center gap-2 mb-4">
//                 <Target size={20} className="text-amber-600" />
//                 <h3 className="text-lg font-semibold text-stone-100">
//                   Recommendations
//                 </h3>
//               </div>

//               <div className="space-y-3">
//                 {insights.recommendations.map((rec, idx) => (
//                   <div
//                     key={idx}
//                     className="bg-stone-900/50 border border-stone-800/50 rounded-lg p-4 hover:border-amber-600/30 transition-colors"
//                   >
//                     <div className="flex items-start gap-3">
//                       <div className="w-8 h-8 rounded-full bg-amber-600/20 flex items-center justify-center shrink-0 mt-1">
//                         <span className="text-amber-400 font-bold text-sm">
//                           {idx + 1}
//                         </span>
//                       </div>
//                       <div>
//                         <p className="font-medium text-stone-100 mb-1">
//                           {rec.title}
//                         </p>
//                         <p className="text-stone-400 text-sm">
//                           {rec.description}
//                         </p>
//                         {rec.impact && (
//                           <p className="text-xs text-green-400 mt-2">
//                             💡 Potential savings: {rec.impact}
//                           </p>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* Categories to Watch
//           {insights.topCategories && insights.topCategories.length > 0 && (
//             <div>
//               <div className="flex items-center gap-2 mb-4">
//                 <TrendingUp size={20} className="text-amber-600" />
//                 <h3 className="text-lg font-semibold text-stone-100">
//                   Top Spending Categories
//                 </h3>
//               </div>

//               <div className="bg-stone-900/50 border border-stone-800/50 rounded-lg p-6">
//                 <div className="space-y-4">
//                   {insights.topCategories.map((cat, idx) => (
//                     <div key={idx}>
//                       <div className="flex justify-between items-center mb-2">
//                         <span className="text-stone-300">{cat.category}</span>
//                         <span className="text-amber-400 font-medium">
//                           ₹{cat.amount.toLocaleString()}
//                         </span>
//                       </div>
//                       <div className="w-full bg-stone-800/50 rounded-full h-2 overflow-hidden">
//                         <div
//                           className="bg-linear-to-r from-amber-600 to-amber-500 h-full rounded-full transition-all duration-500"
//                           style={{
//                             width: `${
//                               insights.topCategories.length > 0
//                                 ? (cat.amount /
//                                     Math.max(
//                                       ...insights.topCategories.map(
//                                         (c) => c.amount,
//                                       ),
//                                     )) *
//                                   100
//                                 : 0
//                             }%`,
//                           }}
//                         />
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           )} */}

//           {/* Insights Tips */}
//           <div className="bg-stone-900/50 border border-stone-800/50 rounded-lg p-6">
//             <h3 className="text-lg font-semibold text-stone-100 mb-4">
//               💭 Quick Tips
//             </h3>
//             <ul className="space-y-3 text-sm">
//               <li className="flex gap-3 text-stone-300">
//                 <span className="text-amber-600">→</span>
//                 Track daily expenses to identify spending patterns early
//               </li>
//               <li className="flex gap-3 text-stone-300">
//                 <span className="text-amber-600">→</span>
//                 Set category budgets to control overspending
//               </li>
//               <li className="flex gap-3 text-stone-300">
//                 <span className="text-amber-600">→</span>
//                 Use receipt uploads to capture all expenses accurately
//               </li>
//               <li className="flex gap-3 text-stone-300">
//                 <span className="text-amber-600">→</span>
//                 Review analytics weekly to stay on top of your finances
//               </li>
//             </ul>
//           </div>
//         </>
//       ) : (
//         <div className="text-center py-12">
//           <p className="text-stone-400 mb-4">No insights available yet</p>
//           <p className="text-sm text-stone-500">
//             Add more expenses to get personalized recommendations
//           </p>
//         </div>
//       )}
//     </div>
//   );
// }
















import { useState, useEffect } from "react";
import { Sparkles, AlertCircle, TrendingUp, Target, RefreshCw } from "lucide-react";

export default function AIInsights() {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fromCache, setFromCache] = useState(false);
  const [cacheAge, setCacheAge] = useState(null);
  const [usedFallback, setUsedFallback] = useState(false);

  const API = import.meta.env.VITE_API_URL;

  // =============================================
  // Fetch insights (checks cache first)
  // =============================================
  const fetchInsights = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API}/api/expenses/insights`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch insights");
      }

      const data = await response.json();

      console.log("📊 Insights Response:", data);

      setInsights(data);
      setFromCache(data.fromCache || false);
      setCacheAge(data.cacheAge || null);
      setUsedFallback(!data.fromAI);

      if (data.fromCache) {
        console.log(` Served from cache (${data.cacheAge} minutes old)`);
      }
      if (!data.fromAI) {
        console.log(" Using offline analysis (API quota limit)");
      }
    } catch (err) {
      console.log(" Error:", err);
      setError(err.message || "Failed to load insights");
    } finally {
      setLoading(false);
    }
  };

  // =============================================
  // Force regenerate (use sparingly!)
  // =============================================
  const regenerateInsights = async () => {
    if (
      !window.confirm(
        " This will use your API quota. Generate new insights?"
      )
    ) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${API}/api/expenses/insights/regenerate`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to regenerate insights");
      }

      const data = await response.json();
      setInsights(data);
      setFromCache(false);
      setCacheAge(0);
      setUsedFallback(!data.fromAI);

      alert("Insights regenerated successfully!");
    } catch (err) {
      setError(err.message || "Failed to regenerate insights");
    } finally {
      setLoading(false);
    }
  };

  // Load insights on mount
  useEffect(() => {
    fetchInsights();
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-stone-100 mb-2">AI Insights</h1>
        <p className="text-stone-400">
          Personalized spending recommendations powered by AI
        </p>
      </div>

      {/* Status Badges */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={fetchInsights}
          disabled={loading}
          className="bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg font-medium transition flex items-center gap-2"
        >
          <Sparkles size={18} />
          {loading ? "Loading..." : "Load Insights"}
        </button>

        <button
          onClick={regenerateInsights}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg font-medium transition flex items-center gap-2"
          title="Uses API quota"
        >
          <RefreshCw size={18} />
          Regenerate ( Uses Quota)
        </button>
      </div>

      {/* Status Info */}
      {fromCache && (
        <div className="bg-green-600/20 border border-green-600/50 rounded-lg p-4">
          <p className="text-green-400 text-sm">
            <strong>Served from cache</strong> ({cacheAge} minutes old)
            <br />
            No API quota used! Click "Regenerate" to get fresh insights.
          </p>
        </div>
      )}

      {usedFallback && !fromCache && (
        <div className="bg-yellow-600/20 border border-yellow-600/50 rounded-lg p-4">
          <p className="text-yellow-400 text-sm">
             <strong>Using offline analysis</strong> - API quota limit reached
            <br />
            Insights are based on your spending data without AI generation.
          </p>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-600/20 border border-red-600/50 rounded-lg flex items-center gap-3 text-red-400 text-sm">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      {loading && !insights ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-24 bg-stone-800/30 rounded-lg animate-pulse"
            ></div>
          ))}
        </div>
      ) : insights ? (
        <>
          {/* Summary Card */}
          <div className="bg-linear-to-br from-amber-600/20 to-amber-700/10 border border-amber-600/30 rounded-lg p-6 backdrop-blur-sm">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-amber-600/20 rounded-lg flex items-center justify-center shrink-0">
                <Sparkles className="text-amber-400" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-stone-100 mb-2">
                  {insights.summary?.title || "Spending Summary"}
                </h3>
                <p className="text-stone-300">
                  {insights.summary?.message ||
                    "Analyzing your spending patterns..."}
                </p>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          {insights.recommendations && insights.recommendations.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Target size={20} className="text-amber-600" />
                <h3 className="text-lg font-semibold text-stone-100">
                  Smart Recommendations
                </h3>
              </div>

              <div className="space-y-3">
                {insights.recommendations.map((rec, idx) => (
                  <div
                    key={idx}
                    className="bg-stone-900/50 border border-stone-800/50 rounded-lg p-4 hover:border-amber-600/30 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-amber-600/20 flex items-center justify-center shrink-0 mt-1">
                        <span className="text-amber-400 font-bold text-sm">
                          {idx + 1}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-stone-100 mb-1">
                          {rec.title}
                        </p>
                        <p className="text-stone-400 text-sm">
                          {rec.description}
                        </p>
                        {rec.impact && (
                          <p className="text-xs text-green-400 mt-2">
                            💡 {rec.impact}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Top Categories */}
          {insights.topCategories && insights.topCategories.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp size={20} className="text-amber-600" />
                <h3 className="text-lg font-semibold text-stone-100">
                  Top Spending Categories
                </h3>
              </div>

              <div className="bg-stone-900/50 border border-stone-800/50 rounded-lg p-6">
                <div className="space-y-4">
                  {insights.topCategories.map((cat, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-stone-300">{cat.category}</span>
                        <span className="text-amber-400 font-medium">
                          ₹{cat.amount.toLocaleString()}
                        </span>
                      </div>
                      <div className="w-full bg-stone-800/50 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-linear-to-r from-amber-600 to-amber-500 h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${
                              insights.topCategories.length > 0
                                ? (cat.amount /
                                    Math.max(
                                      ...insights.topCategories.map(
                                        (c) => c.amount
                                      )
                                    )) *
                                  100
                                : 0
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tips */}
          <div className="bg-stone-900/50 border border-stone-800/50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-stone-100 mb-4">
              💡 Smart Tips
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex gap-3 text-stone-300">
                <span className="text-amber-600">→</span>
                Insights are cached for 24 hours to save API quota
              </li>
              <li className="flex gap-3 text-stone-300">
                <span className="text-amber-600">→</span>
                Click "Regenerate" only when you need fresh analysis
              </li>
              <li className="flex gap-3 text-stone-300">
                <span className="text-amber-600">→</span>
                Cached insights have no cost - use them freely!
              </li>
              <li className="flex gap-3 text-stone-300">
                <span className="text-amber-600">→</span>
                Adding new expenses automatically invalidates old cache
              </li>
            </ul>
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-stone-400 mb-4">No insights available yet</p>
          <p className="text-sm text-stone-500">
            Add some expenses to generate insights
          </p>
        </div>
      )}
    </div>
  );
}
