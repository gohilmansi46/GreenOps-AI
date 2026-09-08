import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import dashboardPreview from "../assets/dashboard-preview.png";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";
import {
  Leaf,
  ShieldCheck,
  Globe,
  Zap,
  Users,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  X,
  Building2,
  Cpu,
  ChevronDown,
} from "lucide-react";

function Home() {
  const [authMode, setAuthMode] = useState(null); // null | "login" | "register"
  const [activeFaq, setActiveFaq] = useState(null);

  // Interactive ESG Calculator State
  const [facilitiesCount, setFacilitiesCount] = useState(8);
  const [energyUsageMwh, setEnergyUsageMwh] = useState(2400);

  // Derived Calculator Metrics
  const estCarbonOffset = Math.round(energyUsageMwh * 0.42 * (facilitiesCount / 2));
  const estEnergySavingsUsd = Math.round(energyUsageMwh * 48 * (facilitiesCount / 3));
  const estEsgScoreUplift = Math.min(35, Math.round(facilitiesCount * 1.8 + energyUsageMwh / 250));
  const equivalentTrees = Math.round(estCarbonOffset * 45);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        setAuthMode(null);
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
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

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const faqs = [
    {
      q: "What regulatory ESG frameworks does GreenOps AI support?",
      a: "GreenOps AI natively aligns with SEBI BRSR (Business Responsibility & Sustainability Reporting), GRI Standards, EU CSRD (Corporate Sustainability Reporting Directive), TCFD Climate Risk Disclosures, and ISO 14001 benchmarks.",
    },
    {
      q: "How does the AI Sustainability Copilot assist ESG managers?",
      a: "Our Google Gemini AI engine analyzes your Scope 1, 2 & 3 carbon data, detects fugitive emissions, calculates Green IT cloud compute footprints, and automatically drafts management-level governance & compliance insights.",
    },
    {
      q: "Can I publish verified ESG metrics to external stakeholders?",
      a: "Yes! GreenOps AI features a built-in Public Transparency & ESG Portal (/public-portal) that allows investors, auditors, and regulators to inspect live, verified carbon metrics and compliance scores.",
    },
    {
      q: "Is my organizational sustainability data secure?",
      a: "All enterprise environmental, social, and governance data is encrypted at rest and in transit using Google Cloud Firebase Security Rules with real-time audit logging.",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-green-950 font-sans selection:bg-green-600 selection:text-white overflow-x-hidden">

      {/* ================= 1. FLOATING GLASSMORPHIC HEADER & NAVIGATION ================= */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-md border-b border-green-100 shadow-xs">
        <div className="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-600 to-green-700 flex items-center justify-center text-white shadow-md shadow-green-600/30 group-hover:scale-105 transition-transform duration-300">
              <Leaf size={22} />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-green-950 flex items-center gap-1">
                GreenOps <span className="text-green-600">AI</span>
              </span>
              <span className="text-[10px] text-green-700 font-extrabold tracking-wider uppercase block -mt-1">
                Enterprise ESG Intelligence
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-green-800">
            <a href="#features" className="hover:text-green-600 transition-colors">Features</a>
            <a href="#frameworks" className="hover:text-green-600 transition-colors">Frameworks</a>
            <a href="#calculator" className="hover:text-green-600 transition-colors">Carbon Calculator</a>
            <a href="#workflow" className="hover:text-green-600 transition-colors">How It Works</a>
            <Link
              to="/public-portal"
              className="text-green-700 bg-green-50 border border-green-200 px-3.5 py-1.5 rounded-full hover:bg-green-100 transition-colors flex items-center gap-1.5 text-xs font-extrabold"
            >
              <Globe size={14} /> Public Portal
            </Link>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setAuthMode("login")}
              className="px-4 py-2 text-sm font-semibold text-green-800 hover:text-green-600 transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => setAuthMode("register")}
              className="px-5 py-2.5 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold text-sm rounded-xl shadow-lg shadow-green-600/25 transition-all duration-300 hover:-translate-y-0.5"
            >
              Get Started Free
            </button>
          </div>
        </div>
      </header>

      {/* ================= 2. HIGH-IMPACT HERO SECTION ================= */}
      <section className="relative pt-36 pb-20 px-6 bg-gradient-to-b from-green-50/80 via-white to-green-50/40 border-b border-green-100 overflow-hidden">
        {/* Background Decorative Glow Effects */}
        <div className="absolute top-10 right-10 w-96 h-96 bg-green-300/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-40 left-10 w-80 h-80 bg-teal-400/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto text-center space-y-8 relative z-10">

          {/* Animated Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-green-200 text-green-800 text-xs font-extrabold shadow-sm">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
            <Sparkles size={14} className="text-green-600" /> ✨ Next-Gen AI Sustainability & Decarbonization Platform
          </div>

          {/* Hero Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-green-950 tracking-tight leading-[1.12] max-w-4xl mx-auto">
            Accelerate Enterprise Decarbonization with{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-teal-600 to-green-700">
              Verified AI Intelligence
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-xl text-green-800/80 max-w-3xl mx-auto leading-relaxed font-normal">
            Automate GHG Scope 1, 2 & 3 accounting, optimize energy and water consumption, streamline SEBI BRSR & EU CSRD disclosures, and leverage Google Gemini AI to achieve your Net-Zero pathways.
          </p>

          {/* Dual Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={() => setAuthMode("register")}
              className="w-full sm:w-auto px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-extrabold text-base rounded-xl shadow-xl shadow-green-600/30 transition-all duration-300 hover:-translate-y-1 flex items-center justify-center gap-2 group"
            >
              Launch ESG Dashboard <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <Link
              to="/public-portal"
              className="w-full sm:w-auto px-8 py-4 bg-white border border-green-200 hover:bg-green-50/80 text-green-900 font-bold text-base rounded-xl shadow-xs transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Globe size={18} className="text-green-600" /> Explore Public Portal
            </Link>
          </div>

          {/* 4-Column Live Metrics Counter */}
          <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="bg-white p-5 rounded-2xl border border-green-200/80 shadow-sm">
              <p className="text-3xl sm:text-4xl font-extrabold text-green-600">99.4%</p>
              <p className="text-xs font-bold text-green-700/80 uppercase tracking-wider mt-1">Compliance Accuracy</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-green-200/80 shadow-sm">
              <p className="text-3xl sm:text-4xl font-extrabold text-green-950">Scope 1-3</p>
              <p className="text-xs font-bold text-green-700/80 uppercase tracking-wider mt-1">Standard Aligned</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-green-200/80 shadow-sm">
              <p className="text-3xl sm:text-4xl font-extrabold text-teal-600">100%</p>
              <p className="text-xs font-bold text-green-700/80 uppercase tracking-wider mt-1">Audit-Ready Exports</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-green-200/80 shadow-sm">
              <p className="text-3xl sm:text-4xl font-extrabold text-green-700">Gemini AI</p>
              <p className="text-xs font-bold text-green-700/80 uppercase tracking-wider mt-1">Decarbonization Copilot</p>
            </div>
          </div>

        </div>
      </section>

      {/* ================= 3. DASHBOARD MOCKUP PREVIEW WITH FLOATING CARDS ================= */}
      <section className="max-w-6xl mx-auto px-6 -mt-8 relative z-20 pb-20">
        <div className="bg-white rounded-3xl p-3 sm:p-4 shadow-2xl border-2 border-green-200 relative">
          
          {/* Browser Header Bar */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-green-100 mb-3 bg-green-50/50 rounded-t-2xl">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-green-400" />
              <span className="w-3 h-3 rounded-full bg-teal-400" />
              <span className="w-3 h-3 rounded-full bg-green-600" />
            </div>
            <div className="bg-white px-6 py-1 rounded-full text-green-800 text-xs font-mono font-bold border border-green-200 shadow-xs">
              https://app.greenops.ai/dashboard
            </div>
            <div className="w-12" />
          </div>

          {/* Image Screenshot */}
          <div className="relative overflow-hidden rounded-2xl border border-green-100">
            <img
              src={dashboardPreview}
              alt="GreenOps AI Platform Dashboard Preview"
              className="w-full object-cover rounded-2xl"
            />

            {/* Floating Overlay Card 1 (Left) */}
            <div className="hidden sm:flex items-center gap-3 absolute bottom-6 left-6 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-green-200 shadow-xl max-w-xs animate-bounce-slow">
              <div className="w-10 h-10 rounded-xl bg-green-100 text-green-700 flex items-center justify-center shrink-0 font-bold">
                <Zap size={20} />
              </div>
              <div>
                <p className="text-xs font-extrabold text-green-950">Real-Time Abatement</p>
                <p className="text-[11px] text-green-700 font-medium">14.5 tCO₂ Scope 1 reduced via fleet electrification.</p>
              </div>
            </div>

            {/* Floating Overlay Card 2 (Right) */}
            <div className="hidden sm:flex items-center gap-3 absolute top-6 right-6 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-green-200 shadow-xl max-w-xs">
              <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center shrink-0 font-bold">
                <ShieldCheck size={20} />
              </div>
              <div>
                <p className="text-xs font-extrabold text-green-950">Regulatory Audit Readiness</p>
                <p className="text-[11px] text-green-700 font-medium">SEBI BRSR & EU CSRD score: 98/100 (Verified).</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ================= 4. CORE ESG PILLARS GRID (E, S, G + GREEN IT) ================= */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-20 space-y-12 border-t border-green-100">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-green-800 bg-green-100 px-3.5 py-1.5 rounded-full border border-green-200">
            Comprehensive Platform Suite
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-green-950">
            Unified ESG & Decarbonization Intelligence
          </h2>
          <p className="text-green-800/80 text-sm sm:text-base">
            Integrated tools for environmental accounting, social equity tracking, corporate governance, and cloud compute optimization.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Card 1: Environmental */}
          <div className="bg-white border border-green-200/90 rounded-3xl p-8 shadow-xs hover:shadow-xl transition-all duration-300 space-y-5">
            <div className="w-14 h-14 rounded-2xl bg-green-100 text-green-700 flex items-center justify-center font-bold">
              <Leaf size={28} />
            </div>
            <div className="space-y-2">
              <span className="text-xs font-extrabold text-green-600 uppercase tracking-wider">Environmental (E)</span>
              <h3 className="text-2xl font-extrabold text-green-950">GHG Scope 1, 2 & 3 Accounting</h3>
              <p className="text-sm text-green-800/80 leading-relaxed">
                Automated carbon calculation engine tracking direct fuel combustion, energy grid consumption, and value-chain vendor logistics.
              </p>
            </div>
            <ul className="space-y-2.5 pt-2 text-xs font-semibold text-green-900">
              <li className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-green-600" /> Direct fuel combustion & fugitive refrigerant tracking
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-green-600" /> Purchased electricity grid emission factors
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-green-600" /> Supply chain Scope 3 category aggregation
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-green-600" /> Verified carbon offset & credit purchase ledger
              </li>
            </ul>
          </div>

          {/* Card 2: Social */}
          <div className="bg-white border border-green-200/90 rounded-3xl p-8 shadow-xs hover:shadow-xl transition-all duration-300 space-y-5">
            <div className="w-14 h-14 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
              <Users size={28} />
            </div>
            <div className="space-y-2">
              <span className="text-xs font-extrabold text-teal-600 uppercase tracking-wider">Social (S)</span>
              <h3 className="text-2xl font-extrabold text-green-950">Workforce & Human Capital Governance</h3>
              <p className="text-sm text-green-800/80 leading-relaxed">
                Monitor diversity metrics, occupational health & safety indicators, wage equity ratios, and community investment programs.
              </p>
            </div>
            <ul className="space-y-2.5 pt-2 text-xs font-semibold text-green-900">
              <li className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-teal-600" /> Executive & workforce diversity ratio analytics
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-teal-600" /> Occupational health & zero-incident compliance
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-teal-600" /> CSR community investment tracking
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-teal-600" /> Employee well-being & safety index monitoring
              </li>
            </ul>
          </div>

          {/* Card 3: Governance */}
          <div className="bg-white border border-green-200/90 rounded-3xl p-8 shadow-xs hover:shadow-xl transition-all duration-300 space-y-5">
            <div className="w-14 h-14 rounded-2xl bg-green-100 text-green-800 flex items-center justify-center font-bold">
              <ShieldCheck size={28} />
            </div>
            <div className="space-y-2">
              <span className="text-xs font-extrabold text-green-700 uppercase tracking-wider">Governance (G)</span>
              <h3 className="text-2xl font-extrabold text-green-950">Corporate Policy & Compliance Matrix</h3>
              <p className="text-sm text-green-800/80 leading-relaxed">
                Centralized policy repository, enterprise risk registers, ethics compliance, and automated audit preparation.
              </p>
            </div>
            <ul className="space-y-2.5 pt-2 text-xs font-semibold text-green-900">
              <li className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-green-600" /> Policy management library & approval workflows
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-green-600" /> Real-time environmental & operational risk scoring
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-green-600" /> Whistleblower & anti-corruption compliance
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-green-600" /> Automated audit log trails & board disclosure exports
              </li>
            </ul>
          </div>

          {/* Card 4: Green IT */}
          <div className="bg-white border border-green-200/90 rounded-3xl p-8 shadow-xs hover:shadow-xl transition-all duration-300 space-y-5">
            <div className="w-14 h-14 rounded-2xl bg-green-100 text-green-600 flex items-center justify-center font-bold">
              <Cpu size={28} />
            </div>
            <div className="space-y-2">
              <span className="text-xs font-extrabold text-green-600 uppercase tracking-wider">Green IT & Cloud</span>
              <h3 className="text-2xl font-extrabold text-green-950">Digital Infrastructure Footprint</h3>
              <p className="text-sm text-green-800/80 leading-relaxed">
                Measure cloud compute energy consumption, optimize AWS / GCP server workloads, and track data center carbon intensity.
              </p>
            </div>
            <ul className="space-y-2.5 pt-2 text-xs font-semibold text-green-900">
              <li className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-green-600" /> Real-time server kWh consumption & PUE telemetry
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-green-600" /> Batch job scheduling during low-carbon grid hours
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-green-600" /> Virtual machine instance rightsizing & energy saving
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-green-600" /> E-waste lifecycle tracking & responsible disposal
              </li>
            </ul>
          </div>

        </div>
      </section>

      {/* ================= 5. INTERACTIVE DECARBONIZATION & ROI CALCULATOR WIDGET (MATCHING GREEN THEME) ================= */}
      <section id="calculator" className="bg-gradient-to-b from-green-900 via-green-950 to-teal-950 text-white py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-green-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto px-6 space-y-12 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-green-300 bg-green-900/90 px-3.5 py-1.5 rounded-full border border-green-700">
              Interactive ROI Estimator
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              Calculate Your Decarbonization Impact
            </h2>
            <p className="text-green-200/80 text-sm sm:text-base">
              Adjust your operating parameters to estimate carbon abatement, financial savings, and ESG score improvements.
            </p>
          </div>

          <div className="bg-green-950/80 border border-green-700/80 rounded-3xl p-6 sm:p-10 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-10 items-center backdrop-blur-md">
            
            {/* Left Controls: Sliders */}
            <div className="lg:col-span-6 space-y-8">
              
              {/* Slider 1: Facilities */}
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm font-bold">
                  <span className="text-green-100 flex items-center gap-2">
                    <Building2 size={16} className="text-green-400" /> Active Operating Facilities
                  </span>
                  <span className="text-green-300 bg-green-900 px-3 py-1 rounded-lg border border-green-700 font-extrabold">
                    {facilitiesCount} Sites
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={facilitiesCount}
                  onChange={(e) => setFacilitiesCount(Number(e.target.value))}
                  className="w-full h-2.5 bg-green-900 rounded-lg appearance-none cursor-pointer accent-green-400"
                />
                <div className="flex justify-between text-[11px] text-green-300/80 font-semibold">
                  <span>1 Site</span>
                  <span>25 Sites</span>
                  <span>50 Sites</span>
                </div>
              </div>

              {/* Slider 2: Energy */}
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm font-bold">
                  <span className="text-green-100 flex items-center gap-2">
                    <Zap size={16} className="text-teal-400" /> Annual Energy Consumption
                  </span>
                  <span className="text-teal-300 bg-green-900 px-3 py-1 rounded-lg border border-green-700 font-extrabold">
                    {energyUsageMwh.toLocaleString()} MWh
                  </span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="10000"
                  step="100"
                  value={energyUsageMwh}
                  onChange={(e) => setEnergyUsageMwh(Number(e.target.value))}
                  className="w-full h-2.5 bg-green-900 rounded-lg appearance-none cursor-pointer accent-teal-400"
                />
                <div className="flex justify-between text-[11px] text-green-300/80 font-semibold">
                  <span>100 MWh</span>
                  <span>5,000 MWh</span>
                  <span>10,000 MWh</span>
                </div>
              </div>

            </div>

            {/* Right Display: Metric Cards */}
            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div className="bg-green-900/90 border border-green-700/90 p-5 rounded-2xl space-y-1">
                <p className="text-xs font-bold text-green-300 uppercase">Est. Carbon Offset</p>
                <p className="text-3xl font-extrabold text-green-300">{estCarbonOffset.toLocaleString()} tCO₂/yr</p>
                <p className="text-[11px] text-green-200/90 pt-1">
                  🌳 Equivalent to <strong className="text-white font-bold">{equivalentTrees.toLocaleString()}</strong> trees planted/yr
                </p>
              </div>

              <div className="bg-green-900/90 border border-green-700/90 p-5 rounded-2xl space-y-1">
                <p className="text-xs font-bold text-teal-300 uppercase">Est. Energy Cost Savings</p>
                <p className="text-3xl font-extrabold text-teal-300">${estEnergySavingsUsd.toLocaleString()}/yr</p>
                <p className="text-[11px] text-green-200/90 pt-1">
                  ⚡ Based on $48/MWh grid optimization efficiency
                </p>
              </div>

              <div className="sm:col-span-2 bg-gradient-to-r from-green-800 to-teal-800 border border-green-600 p-5 rounded-2xl flex items-center justify-between shadow-lg">
                <div>
                  <p className="text-xs font-bold text-green-200 uppercase">ESG Composite Score Uplift</p>
                  <p className="text-2xl font-black text-white">+{estEsgScoreUplift}% Uplift Potential</p>
                </div>
                <button
                  onClick={() => setAuthMode("register")}
                  className="px-4 py-2.5 bg-white hover:bg-green-50 text-green-950 font-extrabold text-xs rounded-xl shadow-md transition shrink-0"
                >
                  Get Custom Audit
                </button>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ================= 6. GLOBAL REGULATORY FRAMEWORK ALIGNMENT BAND ================= */}
      <section id="frameworks" className="bg-white py-16 border-b border-green-100">
        <div className="max-w-7xl mx-auto px-6 space-y-8">
          <div className="text-center">
            <h3 className="text-xs font-extrabold text-green-800/70 uppercase tracking-widest">
              Natively Aligned with International ESG Disclosure Standards
            </h3>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-8">
            {[
              { title: "SEBI BRSR", desc: "Business Responsibility Reporting" },
              { title: "GRI Standards", desc: "Global Reporting Initiative" },
              { title: "EU CSRD", desc: "Corporate Sustainability Directive" },
              { title: "TCFD Climate Risk", desc: "Financial Disclosures" },
              { title: "GHG Protocol", desc: "Scope 1, 2 & 3 Standard" },
              { title: "ISO 14001", desc: "Environmental Management" },
            ].map((f, i) => (
              <div
                key={i}
                className="bg-green-50/60 hover:bg-green-100/80 border border-green-200 px-5 py-3 rounded-2xl transition-all duration-300 text-center space-y-0.5 shadow-xs"
              >
                <p className="font-extrabold text-green-950 text-sm">{f.title}</p>
                <p className="text-[10px] text-green-700 font-medium">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= 7. 4-STEP DECARBONIZATION WORKFLOW ================= */}
      <section id="workflow" className="max-w-7xl mx-auto px-6 py-20 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-green-800 bg-green-100 px-3.5 py-1.5 rounded-full border border-green-200">
            Streamlined Operational Workflow
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-green-950">
            How GreenOps AI Works
          </h2>
          <p className="text-green-800/80 text-sm sm:text-base">
            From raw energy metrics to audit-ready ESG disclosures in four seamless steps.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Step 1 */}
          <div className="bg-white border border-green-200/90 rounded-3xl p-6 shadow-xs relative space-y-4 hover:shadow-lg transition-all duration-300">
            <div className="w-12 h-12 rounded-2xl bg-green-100 text-green-700 flex items-center justify-center font-black text-lg">
              01
            </div>
            <h3 className="font-extrabold text-green-950 text-lg">Data Ingestion</h3>
            <p className="text-xs text-green-800/80 leading-relaxed">
              Connect utility APIs, IoT sensors, cloud telemetry, and CSV records to capture Scope 1, 2 & 3 energy metrics.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white border border-green-200/90 rounded-3xl p-6 shadow-xs relative space-y-4 hover:shadow-lg transition-all duration-300">
            <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center font-black text-lg">
              02
            </div>
            <h3 className="font-extrabold text-green-950 text-lg">Gemini AI Audit</h3>
            <p className="text-xs text-green-800/80 leading-relaxed">
              Google Gemini AI analyzes carbon intensity, detects fugitive emissions, and flags compliance risks.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white border border-green-200/90 rounded-3xl p-6 shadow-xs relative space-y-4 hover:shadow-lg transition-all duration-300">
            <div className="w-12 h-12 rounded-2xl bg-green-100 text-green-800 flex items-center justify-center font-black text-lg">
              03
            </div>
            <h3 className="font-extrabold text-green-950 text-lg">Live Monitoring</h3>
            <p className="text-xs text-green-800/80 leading-relaxed">
              Track real-time KPIs, water usage, workforce diversity ratios, and risk registers via interactive dashboards.
            </p>
          </div>

          {/* Step 4 */}
          <div className="bg-white border border-green-200/90 rounded-3xl p-6 shadow-xs relative space-y-4 hover:shadow-lg transition-all duration-300">
            <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center font-black text-lg">
              04
            </div>
            <h3 className="font-extrabold text-green-950 text-lg">Multi-Export & Publish</h3>
            <p className="text-xs text-green-800/80 leading-relaxed">
              Export PDF/CSV report packages for SEBI BRSR & CSRD, or publish verified metrics to the Public Portal.
            </p>
          </div>

        </div>
      </section>

      {/* ================= 8. INTERACTIVE FAQ ACCORDION ================= */}
      <section className="bg-green-50/50 py-20 border-t border-b border-green-100">
        <div className="max-w-4xl mx-auto px-6 space-y-10">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-green-800 bg-green-100 px-3.5 py-1.5 rounded-full border border-green-200">
              Got Questions?
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-green-950">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-white border border-green-200/80 rounded-2xl overflow-hidden shadow-xs transition"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full px-6 py-5 text-left font-extrabold text-green-950 flex justify-between items-center text-base"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    size={20}
                    className={`text-green-500 transition-transform duration-300 shrink-0 ${
                      activeFaq === idx ? "rotate-180 text-green-700" : ""
                    }`}
                  />
                </button>
                {activeFaq === idx && (
                  <div className="px-6 pb-6 text-sm text-green-800/90 leading-relaxed border-t border-green-100 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= 9. FOOTER & AUTH MODAL INTEGRATIONS (STANDARD GREEN & WHITE) ================= */}
      <footer className="bg-green-950 text-green-100 border-t border-green-900">
        <div className="max-w-7xl mx-auto px-6 py-16 space-y-12">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            
            {/* Brand Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-green-600 flex items-center justify-center text-white font-bold">
                  <Leaf size={20} />
                </div>
                <span className="text-xl font-extrabold text-white">GreenOps AI</span>
              </div>
              <p className="text-xs text-green-200/80 leading-relaxed">
                Enterprise AI platform for ESG accounting, Scope 1-3 GHG management, and automated SEBI BRSR & EU CSRD reporting.
              </p>
            </div>

            {/* Quick Links */}
            <div className="space-y-3 text-xs">
              <h4 className="text-sm font-extrabold text-white">Platform Modules</h4>
              <ul className="space-y-2 text-green-200/80">
                <li><Link to="/dashboard" className="hover:text-green-300 transition">Executive Dashboard</Link></li>
                <li><Link to="/environmental" className="hover:text-green-300 transition">Environmental Accounting</Link></li>
                <li><Link to="/social" className="hover:text-green-300 transition">Social & Diversity</Link></li>
                <li><Link to="/governance" className="hover:text-green-300 transition">Governance & Risk</Link></li>
                <li><Link to="/reports" className="hover:text-green-300 transition">Reports & Exports</Link></li>
              </ul>
            </div>

            {/* Resources */}
            <div className="space-y-3 text-xs">
              <h4 className="text-sm font-extrabold text-white">Disclosures & Portals</h4>
              <ul className="space-y-2 text-green-200/80">
                <li><Link to="/public-portal" className="hover:text-green-300 transition">Public Transparency Portal</Link></li>
                <li><button onClick={() => setAuthMode("login")} className="hover:text-green-300 transition">Account Sign In</button></li>
                <li><button onClick={() => setAuthMode("register")} className="hover:text-green-300 transition">Get Started Free</button></li>
              </ul>
            </div>

            {/* Contact */}
            <div className="space-y-3 text-xs">
              <h4 className="text-sm font-extrabold text-white">Contact & Support</h4>
              <p className="text-green-200/80">📧 support@greenops.ai</p>
              <p className="text-green-200/80">🌐 www.greenops.ai</p>
              <p className="text-green-200/80">🏢 ESG Intelligence Platform</p>
            </div>

          </div>

          <div className="pt-8 border-t border-green-900 flex flex-col sm:flex-row justify-between items-center text-xs text-green-300/70">
            <p>© 2026 GreenOps AI. All Rights Reserved.</p>
            <p className="mt-2 sm:mt-0">Powered by React • Firebase • Google Gemini AI</p>
          </div>

        </div>
      </footer>

      {/* ================= AUTH MODAL BACKDROP & FORMS ================= */}
      {authMode && (
        <div
          className="fixed inset-0 z-50 bg-green-950/60 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setAuthMode(null)}
        >
          <div
            className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative border border-green-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setAuthMode(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-green-50 text-green-700 hover:bg-green-100 transition"
            >
              <X size={18} />
            </button>

            {/* Modal Body */}
            {authMode === "login" ? (
              <>
                <LoginForm />
                <p className="text-center mt-6 text-xs text-green-800">
                  Don't have an account?{" "}
                  <button
                    onClick={() => setAuthMode("register")}
                    className="text-green-600 font-bold hover:underline transition"
                  >
                    Sign Up Free
                  </button>
                </p>
              </>
            ) : (
              <>
                <RegisterForm />
                <p className="text-center mt-6 text-xs text-green-800">
                  Already have an account?{" "}
                  <button
                    onClick={() => setAuthMode("login")}
                    className="text-green-600 font-bold hover:underline transition"
                  >
                    Sign In
                  </button>
                </p>
              </>
            )}
          </div>
        </div>
      )}

    </div>
  );
}

export default Home;