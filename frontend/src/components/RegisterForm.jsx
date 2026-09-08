import { useState } from "react";
import { registerUser, formatAuthError } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { FaLeaf, FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaCheckCircle } from "react-icons/fa";
import toast from "react-hot-toast";

function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Helper to compute basic password strength
  const getPasswordStrength = (pwd) => {
    if (!pwd) return { label: "", color: "bg-gray-200", width: "w-0" };
    if (pwd.length < 6) return { label: "Weak (min 6 chars)", color: "bg-red-500", width: "w-1/3" };
    if (pwd.length >= 8 && /[A-Z]/.test(pwd) && /[0-9]/.test(pwd)) {
      return { label: "Strong", color: "bg-green-600", width: "w-full" };
    }
    return { label: "Medium", color: "bg-yellow-500", width: "w-2/3" };
  };

  const strength = getPasswordStrength(password);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Please enter your full name.");
      return;
    }

    if (!email.trim()) {
      toast.error("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match. Please verify.");
      return;
    }

    setLoading(true);

    try {
      await registerUser(email, password, name);
      toast.success("Account Created Successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(formatAuthError(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleRegister} className="w-full space-y-4">
      {/* Header Logo */}
      <div className="flex flex-col items-center mb-4">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center shadow-lg shadow-green-200/40">
          <FaLeaf className="text-3xl text-green-600" />
        </div>

        <h1 className="mt-3 text-2xl sm:text-3xl font-extrabold text-gray-800 tracking-tight text-center">
          GreenOps AI
        </h1>

        <p className="text-gray-500 text-xs sm:text-sm font-medium text-center mt-1">
          Create Your Enterprise ESG Account
        </p>
      </div>

      {/* Full Name */}
      <div className="relative">
        <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-green-600" />
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 bg-gray-50 hover:border-green-400 hover:bg-white focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-100 outline-none transition-all duration-300 text-sm"
        />
      </div>

      {/* Email Address */}
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

      {/* Password */}
      <div className="relative">
        <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-green-600" />
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Set Password (min. 6 characters)"
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

      {/* Password Strength Indicator */}
      {password && (
        <div className="space-y-1 px-1">
          <div className="flex justify-between items-center text-[11px] font-semibold text-gray-600">
            <span>Password Strength:</span>
            <span className={`font-bold ${strength.color.replace('bg-', 'text-')}`}>{strength.label}</span>
          </div>
          <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div className={`h-full ${strength.color} ${strength.width} transition-all duration-300`} />
          </div>
        </div>
      )}

      {/* Confirm Password */}
      <div className="relative">
        <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-green-600" />
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className={`w-full pl-12 pr-12 py-3 rounded-xl border ${
            confirmPassword && password !== confirmPassword
              ? "border-red-400 bg-red-50/30"
              : confirmPassword && password === confirmPassword
              ? "border-green-500 bg-green-50/30"
              : "border-gray-300 bg-gray-50"
          } outline-none transition-all duration-300 text-sm`}
        />
        {confirmPassword && password === confirmPassword && (
          <FaCheckCircle className="absolute right-4 top-1/2 -translate-y-1/2 text-green-600" />
        )}
      </div>

      {/* Submit Button */}
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
            Creating Account...
          </>
        ) : (
          "Create Account"
        )}
      </button>
    </form>
  );
}

export default RegisterForm;