import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { signOutUser } from "../services/authService";
import ChangePasswordModal from "./ChangePasswordModal";
import { useTheme } from "../context/ThemeContext";
import { FaKey, FaRightFromBracket } from "react-icons/fa6";
import { FaSun, FaMoon } from "react-icons/fa";
import { Menu, X } from "lucide-react";
import toast from "react-hot-toast";

function Sidebar() {
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { darkMode, setDarkMode } = useTheme();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOutUser();
      toast.success("Logged out successfully.");
      setIsMobileOpen(false);
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to log out. Please try again.");
    }
  };

  const closeMobile = () => setIsMobileOpen(false);

  return (
    <>
      {/* Mobile Floating Toggle Menu Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="fixed top-4 left-4 z-50 md:hidden bg-green-900 hover:bg-green-800 text-white p-2.5 rounded-xl shadow-2xl border border-green-700 transition"
        title="Toggle Menu"
      >
        {isMobileOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div
          onClick={closeMobile}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 md:hidden transition-opacity"
        />
      )}

      {/* Sidebar Component */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-green-900 text-white shadow-xl overflow-y-auto z-50 flex flex-col justify-between transition-transform duration-300 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >

        <div className="p-6 pt-16 md:pt-6">

          <h2 className="text-3xl font-bold mb-10">
            GreenOps AI
          </h2>

          <ul className="space-y-3">

            <li>
              <NavLink
                to="/dashboard"
                onClick={closeMobile}
                className={({ isActive }) =>
                  `block p-3 rounded-lg transition-all duration-300 ${
                    isActive
                      ? "bg-green-700 text-white font-semibold shadow-sm"
                      : "hover:bg-green-800 text-green-100"
                  }`
                }
              >
                Dashboard
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/environmental"
                onClick={closeMobile}
                className={({ isActive }) =>
                  `block p-3 rounded-lg transition-all duration-300 ${
                    isActive
                      ? "bg-green-700 text-white font-semibold shadow-sm"
                      : "hover:bg-green-800 text-green-100"
                  }`
                }
              >
                Environmental
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/social"
                onClick={closeMobile}
                className={({ isActive }) =>
                  `block p-3 rounded-lg transition-all duration-300 ${
                    isActive
                      ? "bg-green-700 text-white font-semibold shadow-sm"
                      : "hover:bg-green-800 text-green-100"
                  }`
                }
              >
                Social
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/governance"
                onClick={closeMobile}
                className={({ isActive }) =>
                  `block p-3 rounded-lg transition duration-300 ${
                    isActive
                      ? "bg-green-700 text-white font-semibold shadow-sm"
                      : "hover:bg-green-800 text-green-100"
                  }`
                }
              >
                Governance
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/reports"
                onClick={closeMobile}
                className={({ isActive }) =>
                  `block p-3 rounded-lg transition ${
                    isActive
                      ? "bg-green-700 text-white font-semibold shadow-sm"
                      : "hover:bg-green-800 text-green-100"
                  }`
                }
              >
                Reports
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/public-portal"
                target="_blank"
                onClick={closeMobile}
                className={({ isActive }) =>
                  `block p-3 rounded-lg transition ${
                    isActive
                      ? "bg-green-700 text-white"
                      : "hover:bg-green-800 text-green-200"
                  }`
                }
              >
                🌐 Public Portal ↗
              </NavLink>
            </li>

          </ul>

        </div>

        {/* Account Actions & Dark Mode Toggle */}
        <div className="p-6 border-t border-green-800/80 space-y-2 bg-green-950/40">
          {/* Dark Mode Toggle Button */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="w-full p-2.5 rounded-lg text-xs font-semibold text-green-200 hover:bg-green-800 hover:text-white flex items-center justify-between transition"
          >
            <span className="flex items-center gap-2.5">
              {darkMode ? (
                <FaSun className="text-yellow-400 text-sm" />
              ) : (
                <FaMoon className="text-blue-300 text-sm" />
              )}
              Dark Mode
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-900 text-green-300 font-bold border border-green-700">
              {darkMode ? "ON" : "OFF"}
            </span>
          </button>

          <button
            onClick={() => {
              closeMobile();
              setIsPasswordModalOpen(true);
            }}
            className="w-full p-2.5 rounded-lg text-xs font-semibold text-green-200 hover:bg-green-800 hover:text-white flex items-center gap-2.5 transition"
          >
            <FaKey className="text-green-400" /> Change Password
          </button>

          <button
            onClick={handleLogout}
            className="w-full p-2.5 rounded-lg text-xs font-semibold text-red-300 hover:bg-red-900/60 hover:text-white flex items-center gap-2.5 transition"
          >
            <FaRightFromBracket className="text-red-400" /> Sign Out
          </button>
        </div>

      </aside>

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />
    </>
  );
}

export default Sidebar;