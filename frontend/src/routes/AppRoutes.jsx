import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useState } from "react";
import { Bot } from "lucide-react";
import AIChatDrawer from "../components/AIChatDrawer";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import ProtectedRoute from "../components/ProtectedRoute";
import Environmental from "../pages/Environmental";
import Social from "../pages/Social";
import Governance from "../pages/Governance";
import Reports from "../pages/Reports";
import PublicESGPortal from "../pages/PublicESGPortal";

function GlobalAIChat() {
  const location = useLocation();
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);

  // Hide AI Copilot button on Home page (home.jsx -> '/')
  if (location.pathname === "/") {
    return null;
  }

  return (
    <>
      {/* Floating AI Chat Trigger Button */}
      <button
        onClick={() => setIsAIChatOpen(true)}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 bg-green-700 hover:bg-green-800 text-white p-3 sm:p-4 rounded-full shadow-2xl flex items-center gap-3 transition-all duration-300 hover:scale-105 group border-2 border-green-400"
        title="Ask AI Copilot"
      >
        <Bot size={24} className="group-hover:rotate-12 transition-transform" />
        <span className="text-sm font-bold pr-1 hidden sm:inline">Ask AI Copilot</span>
      </button>

      {/* Persistent AI Drawer */}
      <AIChatDrawer
        isOpen={isAIChatOpen}
        onClose={() => setIsAIChatOpen(false)}
      />
    </>
  );
}

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/public-portal" element={<PublicESGPortal />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/environmental"
          element={
            <ProtectedRoute>
              <Environmental />
            </ProtectedRoute>
          }
        />

        <Route
          path="/social"
          element={
            <ProtectedRoute>
              <Social />
            </ProtectedRoute>
          }
        />

        <Route
          path="/governance"
          element={
            <ProtectedRoute>
              <Governance />
            </ProtectedRoute>
          }
        />

        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <Reports />
            </ProtectedRoute>
          }
        />

      </Routes>
      <GlobalAIChat />
    </BrowserRouter>
  );
}

export default AppRoutes;