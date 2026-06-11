import { NavLink, useNavigate } from "react-router-dom";
import { Menu, X, LogOut } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const logoutHandler = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const linkClass = ({ isActive }) =>
    isActive
      ? "text-amber-600 font-medium border-b-2 border-amber-600 pb-1 transition-colors"
      : "text-stone-400 hover:text-stone-200 transition-colors pb-1";

  return (
    <nav className="fixed top-0 w-full bg-stone-950/95 backdrop-blur-sm border-b border-stone-800/50 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-linear-to-br from-amber-600 to-amber-700 rounded-lg flex items-center justify-center text-white font-bold text-sm group-hover:shadow-lg group-hover:shadow-amber-600/30 transition-all">
              ₹
            </div>
            <span className="text-sm font-semibold text-stone-100 hidden sm:block">
              Expense Track
            </span>
          </NavLink>

          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-8 items-center">
            {token ? (
              <>
                <NavLink to="/" className={linkClass}>
                  Dashboard
                </NavLink>
                <NavLink to="/upload" className={linkClass}>
                  Receipt
                </NavLink>
                <NavLink to="/analytics" className={linkClass}>
                  Analytics
                </NavLink>
                <NavLink to="/ai" className={linkClass}>
                  AI Insights
                </NavLink>
                 <NavLink to="/profile" className={linkClass}>
                  Profile
                </NavLink>

                <button
                  onClick={logoutHandler}
                  className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className={linkClass}>
                  Login
                </NavLink>
                <NavLink to="/signup" className={linkClass}>
                  Signup
                </NavLink>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-stone-400 hover:text-stone-200 transition-colors"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4 border-t border-stone-800/50 pt-4 flex flex-col gap-4">
            {token ? (
              <>
                <NavLink
                  to="/"
                  className={linkClass}
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </NavLink>

                <NavLink
                  to="/upload"
                  className={linkClass}
                  onClick={() => setIsOpen(false)}
                >
                  Receipt
                </NavLink>

                <NavLink
                  to="/analytics"
                  className={linkClass}
                  onClick={() => setIsOpen(false)}
                >
                  Analytics
                </NavLink>

                <NavLink
                  to="/ai"
                  className={linkClass}
                  onClick={() => setIsOpen(false)}
                >
                  AI Insights
                </NavLink>

                <NavLink
                  to="/profile"
                  className={linkClass}
                  onClick={() => setIsOpen(false)}
                >
                  profile
                </NavLink>

                <button
                  onClick={() => {
                    logoutHandler();
                    setIsOpen(false);
                  }}
                  className="text-left text-red-400 hover:text-red-300"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className={linkClass}>
                  Login
                </NavLink>

                <NavLink to="/signup" className={linkClass}>
                  Signup
                </NavLink>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
