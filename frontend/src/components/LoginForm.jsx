import { useState } from "react";
import { loginUser, resetPassword, formatAuthError } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { FaLeaf, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaArrowLeft } from "react-icons/fa";
import toast from "react-hot-toast";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isResetMode, setIsResetMode] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      toast.error("Please enter both email and password.");
      return;
    }

    setLoading(true);

    try {
      await loginUser(email, password);
      toast.success("Login Successful!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      toast.error(formatAuthError(error));
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter your email address to reset password.");
      return;
    }

    setLoading(true);

    try {
      await resetPassword(email);
      setResetEmailSent(true);
      toast.success("Password reset email sent! Check your inbox.");
    } catch (error) {
      console.error("Reset password error:", error);
      toast.error(formatAuthError(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Header Logo */}
      <div className="flex flex-col items-center mb-6">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center shadow-lg shadow-green-200/70">
          <FaLeaf className="text-3xl text-green-600" />
        </div>

        <h1 className="mt-3 text-2xl sm:text-3xl font-extrabold text-gray-800 tracking-tight text-center">
          GreenOps AI
        </h1>

        <p className="text-gray-500 text-xs sm:text-sm font-medium text-center mt-1">
          {isResetMode ? "Reset Your Account Password" : "AI-Powered ESG Sustainability Platform"}
        </p>
      </div>

      {isResetMode ? (
        /* ================= RESET PASSWORD VIEW ================= */
        <form onSubmit={handleResetPassword} className="space-y-4">
          {resetEmailSent ? (
            <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-center space-y-2">
              <p className="text-sm font-bold text-green-800">Email Sent Successfully!</p>
              <p className="text-xs text-green-700">
                We've sent a password reset link to <strong className="font-semibold">{email}</strong>. Check your inbox and follow the instructions.
              </p>
            </div>
          ) : (
            <div className="relative">
              <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-green-600" />
              <input
                type="email"
                placeholder="Enter your registered email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 bg-gray-50 hover:border-green-400 hover:bg-white focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-100 outline-none transition-all duration-300 text-sm"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading || resetEmailSent}
            className={`w-full py-3 rounded-xl font-semibold text-white transition-all duration-300 flex items-center justify-center gap-2 ${
              loading || resetEmailSent
                ? "bg-green-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700 hover:scale-[1.02] active:scale-[0.98] shadow-md"
            }`}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Sending Link...
              </>
            ) : (
              "Send Reset Link"
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              setIsResetMode(false);
              setResetEmailSent(false);
            }}
            className="w-full py-2 text-xs font-semibold text-gray-600 hover:text-green-600 flex items-center justify-center gap-1.5 transition"
          >
            <FaArrowLeft size={12} /> Back to Sign In
          </button>
        </form>
      ) : (
        /* ================= LOGIN VIEW ================= */
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative">
            <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-green-600" />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 bg-gray-50 hover:border-green-400 hover:bg-white focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-100 outline-none transition-all duration-300 text-sm"
            />
          </div>

          <div className="relative">
            <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-green-600" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full pl-12 pr-12 py-3 rounded-xl border border-gray-300 bg-gray-50 hover:border-green-400 hover:bg-white focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-100 outline-none transition-all duration-300 text-sm"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-green-600 transition-colors duration-300"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                className="w-4 h-4 accent-green-600 cursor-pointer rounded"
              />
              <span className="text-xs text-gray-600 font-medium">Remember Me</span>
            </label>

            <button
              type="button"
              onClick={() => setIsResetMode(true)}
              className="text-xs font-semibold text-green-600 hover:text-green-700 hover:underline transition"
            >
              Forgot Password?
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl font-semibold text-white transition-all duration-300 flex items-center justify-center gap-2 ${
              loading
                ? "bg-green-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700 hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg shadow-green-500/20"
            }`}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Signing In...
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>
      )}
    </div>
  );
}

export default LoginForm;