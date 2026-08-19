import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import dashboardPreview from "../assets/dashboard-preview.png";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";
import { X } from "lucide-react";

import {
  FaLeaf,
  FaUsers,
  FaBuilding,
  FaRobot,
  FaChartLine,
  FaCloud,
  FaFileAlt,
  FaPlusCircle,
  FaSeedling,
  FaTimes,
} from "react-icons/fa";

function Home() {
  const [authMode, setAuthMode] = useState(null);
  // null | "login" | "register"
  useEffect(() => {
  const handleEsc = (e) => {
    if (e.key === "Escape") {
      setAuthMode(null);
    }
  };

  window.addEventListener("keydown", handleEsc);

  return () => {
    window.removeEventListener("keydown", handleEsc);
  };
}, []);

useEffect(() => {
  if (authMode) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "auto";
  }

  return () => {
    document.body.style.overflow = "auto";
  };
}, [authMode]);


  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100">

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center pt-28 px-6">

        <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-5 py-2 rounded-full font-semibold mb-6 shadow">
        <FaSeedling className="text-green-600" />
        <span>AI Powered Sustainability Platform</span>
        </div>

        <h1 className="text-6xl md:text-7xl font-extrabold text-green-700">
          GreenOps AI
        </h1>

        <p className="text-2xl text-gray-700 mt-5">
          AI-Powered ESG Management Platform
        </p>

        <p className="mt-6 max-w-3xl text-lg text-gray-600 leading-8">
          Empowering organizations to monitor, analyze and improve
          Environmental, Social and Governance performance using
          Artificial Intelligence, Cloud Analytics and Real-Time
          Sustainability Reporting.
        </p>

        <div className="flex gap-5 mt-10">
  <button
    onClick={() => setAuthMode("register")}
    className="bg-green-600 hover:bg-green-700 hover:scale-105 text-white px-8 py-4 rounded-xl shadow-xl transition-all duration-300 font-semibold"
  >
    Get Started
  </button>

  <button
    onClick={() => setAuthMode("login")}
    className="border-2 border-green-600 text-green-700 hover:bg-green-50 hover:scale-105 px-8 py-4 rounded-xl shadow-md transition-all duration-300 font-semibold"
  >
    Login
  </button>
</div>

      </section>
      {/* ================= DASHBOARD PREVIEW ================= */}

<section className="max-w-7xl mx-auto px-8 py-16">

  <div className="text-center">

<h2 className="text-5xl font-bold text-green-700 mb-6">
        Powerful ESG Dashboard
    </h2>

<p className="text-gray-600 text-xl max-w-3xl mx-auto mb-14">
        Monitor sustainability performance through interactive charts,
      KPI cards and AI-driven insights.
    </p>

  </div>

<div className="rounded-3xl overflow-hidden border border-gray-200 bg-white shadow-2xl transform transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_25px_60px_rgba(0,0,0,0.20)] hover:scale-[1.01]">
  {/* Browser Header */}
  <div className="flex items-center justify-between px-5 py-3 bg-gray-100 border-b">

    <div className="flex gap-2">
      <div className="w-3 h-3 rounded-full bg-red-400"></div>
      <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
      <div className="w-3 h-3 rounded-full bg-green-500"></div>
    </div>

    <p className="text-sm text-gray-600 font-medium">
        Live Dashboard Preview
    </p>

    <div className="w-14"></div>

  </div>

<img
  src={dashboardPreview}
  alt="GreenOps Dashboard"
  className="w-full object-cover transition-transform duration-700 hover:scale-[1.01]"
 />

</div>

</section>

      {/* ESG Cards */}
      <section className="max-w-7xl mx-auto px-8 py-24">

        <div className="grid md:grid-cols-3 gap-8">

          {/* Environmental */}
          <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition">

<div className="text-5xl text-green-600">
  <FaLeaf />
</div>
            <h2 className="text-2xl font-bold text-green-700 mt-5">
              Environmental
            </h2>

            <p className="text-gray-600 mt-4">
              Track Carbon Emissions, Energy Usage,
              Water Consumption and Environmental Impact.
            </p>

          </div>

          {/* Social */}
          <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition">

          <div className="text-5xl text-blue-600">
            <FaUsers />
          </div>
            <h2 className="text-2xl font-bold text-blue-700 mt-5">
              Social
            </h2>

            <p className="text-gray-600 mt-4">
              Monitor Employee Welfare, Diversity,
              Community Engagement and Workplace Safety.
            </p>

          </div>

          {/* Governance */}
          <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition">

          <div className="text-5xl text-purple-600">
            <FaBuilding />
          </div>
            <h2 className="text-2xl font-bold text-purple-700 mt-5">
              Governance
            </h2>

            <p className="text-gray-600 mt-4">
              Improve Compliance, Risk Management,
              Business Ethics and Corporate Governance.
            </p>

          </div>

        </div>

      </section>
      {/* ================= WHY GREENOPS AI ================= */}

<section className="max-w-7xl mx-auto px-8 py-20">

  <div className="text-center mb-14">
    <h2 className="text-4xl font-bold text-green-700">
      Why GreenOps AI?
    </h2>

    <p className="text-gray-600 mt-4 text-lg">
      Everything you need to manage your ESG performance in one intelligent platform.
    </p>
  </div>

  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

    <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition">
      <div className="text-5xl mb-5 text-green-600">
      <FaRobot />
      </div>
      <h3 className="text-xl font-bold text-green-700">
        AI Powered Analysis
      </h3>

      <p className="mt-4 text-gray-600">
        Get intelligent sustainability recommendations using Google Gemini AI.
      </p>
    </div>

    <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition">
      <div className="text-5xl mb-5 text-blue-600">
  <FaChartLine />
</div>

      <h3 className="text-xl font-bold text-blue-700">
        Interactive Dashboard
      </h3>

      <p className="mt-4 text-gray-600">
        Visualize ESG performance through beautiful charts and KPI cards.
      </p>
    </div>

    <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition">
      <div className="text-5xl mb-5 text-cyan-600">
  <FaCloud />
</div>

      <h3 className="text-xl font-bold text-cyan-700">
        Cloud Storage
      </h3>

      <p className="mt-4 text-gray-600">
        Securely store ESG records using Firebase Firestore Database.
      </p>
    </div>

    <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition">
      <div className="text-5xl mb-5 text-purple-600">
  <FaFileAlt />
</div>

      <h3 className="text-xl font-bold text-purple-700">
        ESG Reports
      </h3>

      <p className="mt-4 text-gray-600">
        Generate professional sustainability reports for stakeholders.
      </p>
    </div>

  </div>

</section>

{/* ================= HOW IT WORKS ================= */}

<section className="bg-white py-20">

  <div className="max-w-6xl mx-auto px-8">

    <div className="text-center mb-16">

      <h2 className="text-4xl font-bold text-green-700">
        How GreenOps AI Works
      </h2>

      <p className="text-gray-600 mt-4">
        A simple four-step workflow to manage ESG performance.
      </p>

    </div>

    <div className="grid md:grid-cols-4 gap-8 text-center">

      {/* Step 1 */}
      <div>

        <div className="w-20 h-20 mx-auto rounded-full bg-green-100 flex items-center justify-center text-4xl text-green-600">
          <FaPlusCircle />
        </div>

        <h3 className="font-bold mt-5 text-xl">
          Add ESG Data
        </h3>

        <p className="text-gray-600 mt-3">
          Enter Environmental, Social and Governance metrics.
        </p>

      </div>

      {/* Step 2 */}
      <div>

        <div className="w-20 h-20 mx-auto rounded-full bg-blue-100 flex items-center justify-center text-4xl text-blue-600">
          <FaRobot />
        </div>

        <h3 className="font-bold mt-5 text-xl">
          AI Analysis
        </h3>

        <p className="text-gray-600 mt-3">
          Gemini AI evaluates sustainability performance.
        </p>

      </div>

      {/* Step 3 */}
      <div>

        <div className="w-20 h-20 mx-auto rounded-full bg-purple-100 flex items-center justify-center text-4xl text-purple-600">
          <FaChartLine />
        </div>

        <h3 className="font-bold mt-5 text-xl">
          Dashboard
        </h3>

        <p className="text-gray-600 mt-3">
          Monitor KPIs using live charts and analytics.
        </p>

      </div>

      {/* Step 4 */}
      <div>

        <div className="w-20 h-20 mx-auto rounded-full bg-orange-100 flex items-center justify-center text-4xl text-orange-600">
          <FaFileAlt />
        </div>

        <h3 className="font-bold mt-5 text-xl">
          Generate Report
        </h3>

        <p className="text-gray-600 mt-3">
          Export ESG reports for management and investors.
        </p>

      </div>

    </div>

  </div>

</section>

{/* ================= TECHNOLOGY ================= */}

<section className="py-20">

  <div className="max-w-5xl mx-auto text-center">

    <h2 className="text-4xl font-bold text-green-700 mb-10">
      Technology Stack
    </h2>

    <div className="flex flex-wrap justify-center gap-4">

      <span className="px-6 py-3 bg-green-100 rounded-full font-semibold">
        React
      </span>

      <span className="px-6 py-3 bg-blue-100 rounded-full font-semibold">
        Firebase
      </span>

      <span className="px-6 py-3 bg-purple-100 rounded-full font-semibold">
        Gemini AI
      </span>

      <span className="px-6 py-3 bg-yellow-100 rounded-full font-semibold">
        Tailwind CSS
      </span>

      <span className="px-6 py-3 bg-pink-100 rounded-full font-semibold">
        Firestore
      </span>

      <span className="px-6 py-3 bg-cyan-100 rounded-full font-semibold">
        Recharts
      </span>

    </div>

  </div>

</section>
{/* ================= FOOTER ================= */}

<footer className="bg-green-900 text-white mt-20">

  <div className="max-w-7xl mx-auto px-8 py-16">

    <div className="grid md:grid-cols-4 gap-10">

      {/* Company */}
      <div>

        <h2 className="text-3xl font-bold mb-5">
          GreenOps AI
        </h2>

        <p className="text-green-100 leading-7">
          AI-Powered ESG Management Platform that helps organizations
          monitor, analyze and improve Environmental, Social and
          Governance performance using Artificial Intelligence.
        </p>

      </div>

      {/* Platform */}
      {/* Platform */}
<div>

  <h3 className="text-xl font-semibold mb-5">
    Platform
  </h3>

  <ul className="space-y-3 text-green-100">

    <li>
      <Link
        to="/dashboard"
        className="hover:text-white transition"
      >
        Dashboard
      </Link>
    </li>

    <li>
      <Link
        to="/environmental"
        className="hover:text-white transition"
      >
        Environmental
      </Link>
    </li>

    <li>
      <Link
        to="/social"
        className="hover:text-white transition"
      >
        Social
      </Link>
    </li>

    <li>
      <Link
        to="/governance"
        className="hover:text-white transition"
      >
        Governance
      </Link>
    </li>

    <li>
      <Link
        to="/reports"
        className="hover:text-white transition"
      >
        Reports
      </Link>
    </li>

  </ul>

</div>

      {/* Technologies */}
      <div>

        <h3 className="text-xl font-semibold mb-5">
          Technologies
        </h3>

        <ul className="space-y-3 text-green-100">

          <li>React.js</li>

          <li>Firebase</li>

          <li>Firestore</li>

          <li>Gemini AI</li>

          <li>Tailwind CSS</li>

        </ul>

      </div>

      {/* Contact */}
      <div>

        <h3 className="text-xl font-semibold mb-5">
          Contact
        </h3>

        <p className="text-green-100">
          ESG Management Platform
        </p>

        <p className="mt-3 text-green-100">
          📧 support@greenops.ai
        </p>

        <p className="mt-3 text-green-100">
          🌐 www.greenops.ai
        </p>

      </div>

    </div>

    <hr className="my-10 border-green-700" />

    <div className="flex flex-col md:flex-row justify-between items-center text-green-200">

      <p>
        © 2026 GreenOps AI. All Rights Reserved.
      </p>

      <p className="mt-4 md:mt-0">
        Built using React • Firebase • Gemini AI
      </p>

    </div>

  </div>

</footer>

{/* Authentication Modal */}
{authMode && (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
    onClick={() => setAuthMode(null)}
  >
    <div
      onClick={(e) => e.stopPropagation()}
      className="relative bg-white rounded-3xl shadow-2xl w-[92%] sm:w-[450px] p-8 animate-[modalOpen_0.35s_ease] origin-center"
    >

{/* Close Button */}
    <button
  onClick={() => setAuthMode(null)}
  className="absolute top-5 right-5 flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-500 transition-all duration-300 hover:bg-red-200 hover:rotate-90"
>
  <X size={20} strokeWidth={2.5} />
</button>

{/* Dynamic Form */}
      <div
  key={authMode}
  className="animate-[fadeIn_0.35s_ease]"
>
  {authMode === "login" ? (
    <>
      <LoginForm />

      <p className="text-center mt-6 text-gray-600">
        Don't have an account?{" "}
        <button
          onClick={() => setAuthMode("register")}
          className="text-green-600 font-semibold hover:underline transition"
        >
          Sign Up
        </button>
      </p>
    </>
  ) : (
    <>
      <RegisterForm />

      <p className="text-center mt-6 text-gray-600">
        Already have an account?{" "}
        <button
          onClick={() => setAuthMode("login")}
          className="text-green-600 font-semibold hover:underline transition"
        >
          Login
        </button>
      </p>
    </>
  )}
</div>
    </div>
  </div>
)}
    </div>
  );
}

export default Home;