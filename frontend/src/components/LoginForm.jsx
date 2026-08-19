import { useState } from "react";
import { loginUser } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { FaLeaf } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi2";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import toast from "react-hot-toast";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

const handleLogin = async (e) => {
  e.preventDefault();

  setLoading(true);

  try {
    await loginUser(email, password);

    toast.success("Login Successful!");
    navigate("/dashboard");

  } catch (error) {
    toast.error("Invalid email or password");

  } finally {
    setLoading(false);
  }
};

  return (
    <form
      onSubmit={handleLogin}
      className="w-full"
    >
      <div className="flex flex-col items-center mb-8">

  <div className="w-18 h-18 rounded-full bg-green-100 flex items-center justify-center shadow-lg shadow-green-200/70">

    <FaLeaf className="text-4xl text-green-600" />

  </div>

<h1 className="mt-4 text-3xl sm:text-4xl font-extrabold text-gray-800 tracking-tight text-center">
  GreenOps AI
</h1>

 <div className="flex items-center justify-center mt-2">


  <p className="text-gray-500 text-xs sm:text-sm font-medium leading-none">
    AI-Powered ESG Sustainability Platform
  </p>

</div>

</div>

      <div className="relative mb-5">

  <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-green-600" />

  <input
    type="email"
    placeholder="Email Address"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 bg-gray-50 hover:border-green-400 hover:bg-white focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-100 outline-none transition-all duration-300"
  />

</div>

      <div className="relative mb-6">

  <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-green-600" />

  <input
    type={showPassword ? "text" : "password"}
    placeholder="Password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 bg-gray-50 hover:border-green-400 hover:bg-white focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-100 outline-none transition-all duration-300"
  />

  <button
  type="button"
  onClick={() => setShowPassword(!showPassword)}
  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-green-600 transition-colors duration-300"
  >
  {showPassword ? <FaEyeSlash /> : <FaEye />}
  </button>

</div>
<div className="flex items-center justify-between mb-6">

  <label className="flex items-center gap-2 cursor-pointer">

    <input
      type="checkbox"
      checked={rememberMe}
      onChange={() => setRememberMe(!rememberMe)}
      className="w-4 h-4 accent-green-600 cursor-pointer"
    />

    <span className="text-sm text-gray-600 font-medium">
      Remember Me
    </span>

  </label>

  <button
    type="button"
    className="text-sm font-semibold text-green-600 hover:text-green-700 hover:underline transition"
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
      : "bg-green-600 hover:bg-green-700 hover:scale-[1.03] active:scale-[0.98] shadow-lg hover:shadow-2xl hover:shadow-green-400/40"
  }`}
>
  {loading ? (
    <>
      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
      Signing In...
    </>
  ) : (
    "Login"
  )}
</button>
    </form>
  );
}

export default LoginForm;