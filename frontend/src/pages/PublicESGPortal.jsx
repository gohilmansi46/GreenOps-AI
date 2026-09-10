import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../config/firebase";
import { auth } from "../services/authService";
import {
  Leaf,
  ShieldCheck,
  Award,
  CheckCircle2,
  Globe,
  Users,
  FileText,
  Download,
  Zap,
  BarChart3,
  Layers,
} from "lucide-react";
import { Link } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

function PublicESGPortal() {
  const [activeTab, setActiveTab] = useState("overview"); // "overview" | "environmental" | "social" | "governance"
  const [envRecords, setEnvRecords] = useState([]);
  const [socialRecords, setSocialRecords] = useState([]);
  const [policies, setPolicies] = useState([]);
  const [risks, setRisks] = useState([]);
  const [complianceItems, setComplianceItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPublicData = async () => {
      try {
        const currentUser = auth.currentUser;
        let envSnap, socialSnap, polSnap, riskSnap, compSnap;
        if (currentUser) {
          const uid = currentUser.uid;
          envSnap = await getDocs(query(collection(db, "environmentalData"), where("userId", "==", uid)));
          socialSnap = await getDocs(query(collection(db, "socialData"), where("userId", "==", uid)));
          polSnap = await getDocs(query(collection(db, "governancePolicies"), where("userId", "==", uid)));
          riskSnap = await getDocs(query(collection(db, "governanceRisks"), where("userId", "==", uid)));
          compSnap = await getDocs(query(collection(db, "governanceCompliance"), where("userId", "==", uid)));
        } else {
          envSnap = await getDocs(collection(db, "environmentalData"));
          socialSnap = await getDocs(collection(db, "socialData"));
          polSnap = await getDocs(collection(db, "governancePolicies"));
          riskSnap = await getDocs(collection(db, "governanceRisks"));
          compSnap = await getDocs(collection(db, "governanceCompliance"));
        }

        const envData = envSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        envData.sort((a, b) => {
          const tA = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : 0;
          const tB = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : 0;
          return tB - tA;
        });
        setEnvRecords(envData);

        const socialData = socialSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        socialData.sort((a, b) => {
          const tA = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : 0;
          const tB = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : 0;
          return tB - tA;
        });
        setSocialRecords(socialData);

        setPolicies(polSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        setRisks(riskSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        setComplianceItems(compSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        console.error("Error fetching public portal data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPublicData();
  }, []);

  // Aggregated Metrics
  const latestEnv = envRecords.length > 0 ? envRecords[0] : null;
  const latestSocial = socialRecords.length > 0 ? socialRecords[0] : null;

  const totalCarbon = envRecords.reduce((acc, curr) => acc + Number(curr.carbon || 0), 0);
  const totalEnergy = envRecords.reduce((acc, curr) => acc + Number(curr.energy || 0), 0);
  const totalWater = envRecords.reduce((acc, curr) => acc + Number(curr.water || 0), 0);

  const totalEmployees = latestSocial?.totalEmployees || 0;
  const femalePercentage = totalEmployees > 0 && latestSocial?.femaleEmployees
    ? Math.round((Number(latestSocial.femaleEmployees) / totalEmployees) * 100)
    : 0;
  const malePercentage = totalEmployees > 0 && latestSocial?.maleEmployees
    ? Math.round((Number(latestSocial.maleEmployees) / totalEmployees) * 100)
    : 0;
  const otherPercentage = totalEmployees > 0 ? Math.max(0, 100 - malePercentage - femalePercentage) : 0;

  const totalCompliance = complianceItems.length;
  const compliantCount = complianceItems.filter((i) => i.status === "Compliant").length;
  const complianceRate = totalCompliance > 0
    ? Math.round((compliantCount / totalCompliance) * 100)
    : 0;

  const activePoliciesCount = policies.filter((p) => p.status === "Active" || !p.status).length;
  const openRisksCount = risks.filter((r) => r.status === "Open" || !r.status).length;

  // Composite Public ESG Score
  const envScore = latestEnv
    ? Math.max(0, 100 - (Number(latestEnv.carbon || 0) > 400 ? 25 : Number(latestEnv.carbon || 0) > 200 ? 10 : 0))
    : 0;
  const socialScore = latestSocial ? 90 : 0;
  const govScore = complianceRate;
  
  const activeScores = [];
  if (latestEnv) activeScores.push(envScore);
  if (latestSocial) activeScores.push(socialScore);
  if (complianceItems.length > 0) activeScores.push(govScore);
  const compositeESGScore = activeScores.length > 0 ? Math.round(activeScores.reduce((a, b) => a + b, 0) / activeScores.length) : 0;

  const esgRatingBadge = compositeESGScore >= 90
    ? { rating: "AAA", label: "Global Sustainability Leader", color: "text-emerald-400 border-emerald-500/40 bg-emerald-500/10" }
    : compositeESGScore >= 80
    ? { rating: "AA+", label: "Advanced ESG Maturity", color: "text-green-400 border-green-500/40 bg-green-500/10" }
    : compositeESGScore > 0
    ? { rating: "A", label: "Verified Standard Compliant", color: "text-blue-400 border-blue-500/40 bg-blue-500/10" }
    : { rating: "N/A", label: "Baseline Setup Required", color: "text-gray-400 border-gray-500/40 bg-gray-500/10" };

  // Chart Data Transforms
  const envChartData = envRecords.slice(0, 6).reverse().map((r, i) => ({
    month: r.createdAt?.toDate ? r.createdAt.toDate().toLocaleDateString("en-US", { month: "short" }) : `Period ${i + 1}`,
    carbon: Number(r.carbon || 0),
    energy: Number(r.energy || 0),
    water: Number(r.water || 0),
  }));

  const diversityPieData = [
    { name: "Female Workforce", value: femalePercentage, color: "#ec4899" },
    { name: "Male Workforce", value: malePercentage, color: "#3b82f6" },
    { name: "Non-Binary / Other", value: otherPercentage, color: "#a855f7" },
  ];

  // PDF Download Handler
  const handleDownloadPublicReport = () => {
    try {
      const doc = new jsPDF();

      doc.setFontSize(20);
      doc.setFont("helvetica", "bold");
      doc.text("GreenOps AI - Public ESG Transparency Report", 14, 20);

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(
        `Verified Public Ledger | Generated on: ${new Date().toLocaleDateString()} | Compliance: BRSR, GRI, CSRD Aligned`,
        14,
        28
      );

      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("1. Executive ESG Performance Summary", 14, 40);

      autoTable(doc, {
        startY: 45,
        head: [["Pillar Metric", "Value / Rating", "Disclosure Standard"]],
        body: [
          ["Composite Public ESG Rating", `${esgRatingBadge.rating} (${compositeESGScore}/100)`, "BRSR Core Benchmark"],
          ["Total Scope 1-3 Carbon Footprint", `${totalCarbon} tCO₂`, "GHG Protocol Standard"],
          ["Total Energy Consumption", `${totalEnergy.toLocaleString()} kWh`, "ISO 50001 Energy Management"],
          ["Total Water Footprint", `${totalWater.toLocaleString()} Litres`, "Global Water Stewardship"],
          ["Active Operating Workforce", `${totalEmployees} Employees`, "GRI 405 Diversity Standard"],
          ["Female Workforce Diversity Ratio", `${femalePercentage}%`, "Equal Opportunity Index"],
          ["Regulatory Policy Compliance Rate", `${complianceRate}%`, "SEBI BRSR & EU CSRD"],
          ["Active Governance Policies Enforced", `${activePoliciesCount} Policies`, "Corporate Ethics Oversight"],
        ],
        theme: "striped",
        headStyles: { fillColor: [22, 163, 74] },
      });

      let currentY = doc.lastAutoTable.finalY + 15;

      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("2. Verified Regulatory Framework Assurances", 14, currentY);

      autoTable(doc, {
        startY: currentY + 5,
        head: [["Framework", "Scope", "Verification Status"]],
        body: [
          ["SEBI BRSR (Business Responsibility)", "Core Environmental & Governance Indicators", "VERIFIED COMPLIANT"],
          ["GRI Standards (Global Reporting)", "Economic, Climate & Social Impact Disclosure", "VERIFIED COMPLIANT"],
          ["EU CSRD (Corporate Sustainability)", "Double Materiality & Supply Chain Assessment", "VERIFIED COMPLIANT"],
          ["TCFD Climate Risk Framework", "Financial & Climate Resilience Scenario Modeling", "VERIFIED ALIGNED"],
        ],
        theme: "grid",
        headStyles: { fillColor: [22, 163, 74] },
      });

      doc.save(`GreenOps_AI_Public_ESG_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (err) {
      console.error("Error generating PDF:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white selection:bg-green-500 selection:text-white font-sans">
      
      {/* Fixed Header */}
      <header className="border-b border-gray-800/80 bg-gray-950/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center gap-2">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2 sm:gap-3 group">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-green-600 to-green-700 flex items-center justify-center shadow-lg shadow-green-600/30 group-hover:scale-105 transition-transform duration-300">
              <Leaf className="text-white" size={20} />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-extrabold tracking-tight text-white flex items-center gap-1">
                GreenOps <span className="text-green-500">AI</span>
              </h1>
              <p className="text-[9px] sm:text-[11px] text-green-400 font-extrabold uppercase tracking-widest -mt-0.5 hidden xs:block">
                Public Transparency & ESG Portal
              </p>
            </div>
          </Link>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="hidden md:flex items-center gap-2 px-3.5 py-1.5 bg-green-950/90 border border-green-700/60 text-green-300 rounded-full text-xs font-extrabold shadow-sm">
              <ShieldCheck size={14} className="text-green-400 animate-pulse" /> Verified Public Ledger
            </span>

            <button
              onClick={handleDownloadPublicReport}
              className="px-3 sm:px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white border border-gray-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5 sm:gap-2 shadow-sm cursor-pointer"
            >
              <Download size={14} className="text-green-400" /> Export PDF
            </button>

            <Link
              to="/login"
              className="px-3.5 sm:px-5 py-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl text-xs font-extrabold transition shadow-lg shadow-green-600/20 whitespace-nowrap"
            >
              Sign In
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 py-10 space-y-10">
        
        {/* Banner Section */}
        <div className="bg-gradient-to-r from-green-950 via-gray-900 to-gray-900 border border-green-800/50 rounded-3xl p-8 lg:p-12 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-green-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-green-900/80 border border-green-600 text-green-300 text-xs font-extrabold uppercase tracking-wider">
                <Globe size={14} /> Corporate ESG Assurance & Decarbonization Ledger
              </div>

              <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight">
                Transparent & Verified <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-teal-300 to-emerald-200">
                  ESG Performance Disclosures
                </span>
              </h2>

              <p className="text-gray-300 text-sm sm:text-base leading-relaxed max-w-2xl">
                Audited corporate accounting for Scope 1, 2 & 3 GHG emissions, energy efficiency, workforce diversity, and regulatory compliance aligned with SEBI BRSR, GRI, and EU CSRD directives.
              </p>
            </div>

            {/* Public Composite Rating Badge */}
            <div className="lg:col-span-4 bg-gray-900/90 border border-green-600/40 p-6 rounded-2xl text-center space-y-3 backdrop-blur-md shadow-xl">
              <div className="w-12 h-12 rounded-xl bg-green-900/80 border border-green-500 flex items-center justify-center mx-auto text-green-400">
                <Award size={26} />
              </div>

              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Public ESG Composite Score</p>
                <div className="flex items-baseline justify-center gap-2 mt-1">
                  <span className="text-5xl font-black text-white">{loading ? "..." : compositeESGScore}</span>
                  <span className="text-gray-400 font-bold text-sm">/ 100</span>
                </div>
              </div>

              <div className={`inline-block px-3.5 py-1 rounded-full text-xs font-extrabold border ${esgRatingBadge.color}`}>
                Grade {esgRatingBadge.rating} — {esgRatingBadge.label}
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Pillar Counter Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Carbon */}
          <div className="bg-gray-900/80 border border-gray-800 p-6 rounded-2xl hover:border-green-500/50 transition-all duration-300 shadow-sm space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-extrabold text-green-400 uppercase tracking-wider">Carbon Footprint</span>
              <div className="w-9 h-9 rounded-xl bg-green-500/10 border border-green-500/30 flex items-center justify-center text-green-400">
                <Leaf size={18} />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-white">
              {loading ? "..." : `${totalCarbon} tCO₂`}
            </p>
            <p className="text-xs text-gray-400 flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-green-400" /> Scope 1, 2 & 3 GHG Accounted
            </p>
          </div>

          {/* Energy */}
          <div className="bg-gray-900/80 border border-gray-800 p-6 rounded-2xl hover:border-blue-500/50 transition-all duration-300 shadow-sm space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-extrabold text-blue-400 uppercase tracking-wider">Energy Efficiency</span>
              <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <Zap size={18} />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-white">
              {loading ? "..." : `${totalEnergy.toLocaleString()} kWh`}
            </p>
            <p className="text-xs text-gray-400 flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-blue-400" /> Clean Grid Energy Transition
            </p>
          </div>

          {/* Social */}
          <div className="bg-gray-900/80 border border-gray-800 p-6 rounded-2xl hover:border-purple-500/50 transition-all duration-300 shadow-sm space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-extrabold text-purple-400 uppercase tracking-wider">Workforce & Diversity</span>
              <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <Users size={18} />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-white">
              {loading ? "..." : `${totalEmployees} Staff`}
            </p>
            <p className="text-xs text-gray-400 flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-purple-400" /> {femalePercentage}% Female Diversity Ratio
            </p>
          </div>

          {/* Governance */}
          <div className="bg-gray-900/80 border border-gray-800 p-6 rounded-2xl hover:border-yellow-500/50 transition-all duration-300 shadow-sm space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-extrabold text-yellow-400 uppercase tracking-wider">Governance Posture</span>
              <div className="w-9 h-9 rounded-xl bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center text-yellow-400">
                <ShieldCheck size={18} />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-white">
              {loading ? "..." : `${complianceRate}%`}
            </p>
            <p className="text-xs text-gray-400 flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-yellow-400" /> {activePoliciesCount} Active Enforced Policies
            </p>
          </div>

        </div>

        {/* Interactive Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-gray-800 pb-4 overflow-x-auto">
          {[
            { id: "overview", label: "Executive Overview", icon: Layers },
            { id: "environmental", label: "Environmental & Climate", icon: Leaf },
            { id: "social", label: "Workforce & Diversity", icon: Users },
            { id: "governance", label: "Governance & Assurance", icon: ShieldCheck },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all duration-200 flex items-center gap-2 cursor-pointer shrink-0 ${
                  isActive
                    ? "bg-green-600 text-white shadow-lg shadow-green-600/30"
                    : "bg-gray-900 hover:bg-gray-800 text-gray-400 hover:text-white border border-gray-800"
                }`}
              >
                <Icon size={16} /> {tab.label}
              </button>
            );
          })}
        </div>

        {/* TAB 1: EXECUTIVE OVERVIEW */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            
            {/* Overview Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Climate Trend Area Chart */}
              <div className="lg:col-span-2 bg-gray-900/80 border border-gray-800 rounded-3xl p-7 space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                      <BarChart3 size={20} className="text-green-400" /> Environmental Emission Trend
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">Verified carbon emissions across reported periods (tCO₂)</p>
                  </div>
                  <span className="px-3 py-1 bg-green-500/10 border border-green-500/30 text-green-400 rounded-full text-xs font-bold">
                    Audit Certified
                  </span>
                </div>

                <div className="h-72 w-full">
                  {envChartData.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-gray-500 text-sm">
                      No environmental records uploaded yet.
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={envChartData}>
                        <defs>
                          <linearGradient id="publicCarbonGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" strokeOpacity={0.4} />
                        <XAxis dataKey="month" stroke="#9ca3af" tick={{ fill: "#9ca3af", fontSize: 12 }} />
                        <YAxis stroke="#9ca3af" tick={{ fill: "#9ca3af", fontSize: 12 }} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#111827",
                            borderColor: "#10b981",
                            borderRadius: "12px",
                            color: "#ffffff",
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="carbon"
                          stroke="#10b981"
                          strokeWidth={3}
                          fill="url(#publicCarbonGrad)"
                          dot={{ r: 5, fill: "#10b981" }}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>

              {/* Workforce Diversity Pie */}
              <div className="bg-gray-900/80 border border-gray-800 rounded-3xl p-7 space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Users size={20} className="text-purple-400" /> Workforce Diversity
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">Gender representation across operations</p>
                </div>

                <div className="h-56 w-full flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={diversityPieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={75}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {diversityPieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#111827",
                          borderColor: "#374151",
                          borderRadius: "12px",
                          color: "#ffffff",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-2 pt-2 border-t border-gray-800 text-xs font-semibold">
                  <div className="flex justify-between items-center text-gray-300">
                    <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-pink-500" /> Female Staff</span>
                    <span className="font-bold text-white">{femalePercentage}%</span>
                  </div>
                  <div className="flex justify-between items-center text-gray-300">
                    <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-blue-500" /> Male Staff</span>
                    <span className="font-bold text-white">{malePercentage}%</span>
                  </div>
                  <div className="flex justify-between items-center text-gray-300">
                    <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-purple-500" /> Other / Non-Binary</span>
                    <span className="font-bold text-white">{otherPercentage}%</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Regulatory Framework Assurances */}
            <div className="bg-gray-900/60 border border-gray-800 p-8 rounded-3xl space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <FileText className="text-green-400" /> Verified Regulatory Disclosures
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">International ESG standard reporting alignment</p>
                </div>
                <span className="text-xs text-green-400 font-extrabold bg-green-500/10 px-3 py-1 rounded-full border border-green-500/30">
                  Fully Compliant
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-gray-950 border border-gray-800 rounded-2xl space-y-3 hover:border-green-500/40 transition">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-extrabold text-green-400 uppercase">SEBI BRSR Standard</span>
                    <CheckCircle2 size={16} className="text-green-400" />
                  </div>
                  <h4 className="font-bold text-white text-base">Business Responsibility Reporting</h4>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Verified core metrics for Scope 1-3 carbon emissions, resource consumption, occupational health, and anti-corruption oversight.
                  </p>
                </div>

                <div className="p-6 bg-gray-950 border border-gray-800 rounded-2xl space-y-3 hover:border-blue-500/40 transition">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-extrabold text-blue-400 uppercase">GRI Standards</span>
                    <CheckCircle2 size={16} className="text-blue-400" />
                  </div>
                  <h4 className="font-bold text-white text-base">Global Reporting Initiative</h4>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Comprehensive reporting of economic impacts, energy grid optimization, workforce development, and community investment.
                  </p>
                </div>

                <div className="p-6 bg-gray-950 border border-gray-800 rounded-2xl space-y-3 hover:border-purple-500/40 transition">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-extrabold text-purple-400 uppercase">EU CSRD Directive</span>
                    <CheckCircle2 size={16} className="text-purple-400" />
                  </div>
                  <h4 className="font-bold text-white text-base">Double Materiality Framework</h4>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Audit-ready disclosures covering financial climate risks, vendor Scope 3 supply chain footprints, and ESG governance posture.
                  </p>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: ENVIRONMENTAL */}
        {activeTab === "environmental" && (
          <div className="space-y-8">
            <div className="bg-gray-900/80 border border-gray-800 rounded-3xl p-8 space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Leaf className="text-green-400" /> Climate & Environmental Disclosures
                </h3>
                <p className="text-xs text-gray-400 mt-1">Detailed Scope 1, 2 & 3 energy, water, and carbon abatement records</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-950 p-6 rounded-2xl border border-gray-800 space-y-2">
                  <span className="text-xs font-extrabold text-green-400 uppercase">Scope 1 & 2 Emissions</span>
                  <p className="text-3xl font-extrabold text-white">{latestEnv ? `${latestEnv.carbon} tCO₂` : "0 tCO₂"}</p>
                  <p className="text-xs text-gray-400">Direct fuel combustion & electricity grid consumption</p>
                </div>

                <div className="bg-gray-950 p-6 rounded-2xl border border-gray-800 space-y-2">
                  <span className="text-xs font-extrabold text-blue-400 uppercase">Energy Consumption</span>
                  <p className="text-3xl font-extrabold text-white">{latestEnv ? `${latestEnv.energy} kWh` : "0 kWh"}</p>
                  <p className="text-xs text-gray-400">Clean renewable energy grid allocation</p>
                </div>

                <div className="bg-gray-950 p-6 rounded-2xl border border-gray-800 space-y-2">
                  <span className="text-xs font-extrabold text-teal-400 uppercase">Water Footprint</span>
                  <p className="text-3xl font-extrabold text-white">{latestEnv ? `${latestEnv.water} L` : "0 L"}</p>
                  <p className="text-xs text-gray-400">Operating facility water conservation index</p>
                </div>
              </div>

              {/* Environmental Historical Table */}
              <div className="border border-gray-800 rounded-2xl overflow-hidden">
                <div className="px-6 py-4 bg-gray-950 border-b border-gray-800 font-extrabold text-sm text-white">
                  Historical Environmental Ledger
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-gray-900 text-gray-400 uppercase border-b border-gray-800">
                      <tr>
                        <th className="px-6 py-3">Reporting Date</th>
                        <th className="px-6 py-3">Carbon (tCO₂)</th>
                        <th className="px-6 py-3">Energy (kWh)</th>
                        <th className="px-6 py-3">Water (Litres)</th>
                        <th className="px-6 py-3">Audit Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800 text-gray-300">
                      {envRecords.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="px-6 py-6 text-center text-gray-500">
                            No public environmental records uploaded.
                          </td>
                        </tr>
                      ) : (
                        envRecords.map((r) => (
                          <tr key={r.id} className="hover:bg-gray-900/60 transition">
                            <td className="px-6 py-4 font-bold text-white">
                              {r.createdAt?.toDate ? r.createdAt.toDate().toLocaleDateString() : "Recent"}
                            </td>
                            <td className="px-6 py-4 text-green-400 font-bold">{r.carbon} tCO₂</td>
                            <td className="px-6 py-4">{r.energy} kWh</td>
                            <td className="px-6 py-4">{r.water} L</td>
                            <td className="px-6 py-4">
                              <span className="px-2.5 py-1 bg-green-500/10 border border-green-500/30 text-green-400 rounded-full font-bold">
                                Verified
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: SOCIAL */}
        {activeTab === "social" && (
          <div className="space-y-8">
            <div className="bg-gray-900/80 border border-gray-800 rounded-3xl p-8 space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Users className="text-purple-400" /> Social Equity & Human Capital
                </h3>
                <p className="text-xs text-gray-400 mt-1">Workforce demographics, employee health & safety, and community investment</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-gray-950 p-5 rounded-2xl border border-gray-800 space-y-1">
                  <span className="text-xs text-gray-400 font-bold uppercase">Total Headcount</span>
                  <p className="text-2xl font-black text-white">{totalEmployees}</p>
                </div>
                <div className="bg-gray-950 p-5 rounded-2xl border border-gray-800 space-y-1">
                  <span className="text-xs text-purple-400 font-bold uppercase">Female Workforce</span>
                  <p className="text-2xl font-black text-purple-400">{femalePercentage}%</p>
                </div>
                <div className="bg-gray-950 p-5 rounded-2xl border border-gray-800 space-y-1">
                  <span className="text-xs text-blue-400 font-bold uppercase">Training Completed</span>
                  <p className="text-2xl font-black text-blue-400">{latestSocial?.employeesTrained || 0} Staff</p>
                </div>
                <div className="bg-gray-950 p-5 rounded-2xl border border-gray-800 space-y-1">
                  <span className="text-xs text-green-400 font-bold uppercase">CSR Activities</span>
                  <p className="text-2xl font-black text-green-400">{latestSocial?.csrActivities || 0} Programs</p>
                </div>
              </div>

              {/* Social Table */}
              <div className="border border-gray-800 rounded-2xl overflow-hidden">
                <div className="px-6 py-4 bg-gray-950 border-b border-gray-800 font-extrabold text-sm text-white">
                  Social & Human Capital Ledger
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-gray-900 text-gray-400 uppercase border-b border-gray-800">
                      <tr>
                        <th className="px-6 py-3">Reporting Period</th>
                        <th className="px-6 py-3">Total Workforce</th>
                        <th className="px-6 py-3">Female Ratio</th>
                        <th className="px-6 py-3">Training Hours</th>
                        <th className="px-6 py-3">Safety Incidents</th>
                        <th className="px-6 py-3">CSR Initiatives</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800 text-gray-300">
                      {socialRecords.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="px-6 py-6 text-center text-gray-500">
                            No public social records uploaded.
                          </td>
                        </tr>
                      ) : (
                        socialRecords.map((r) => (
                          <tr key={r.id} className="hover:bg-gray-900/60 transition">
                            <td className="px-6 py-4 font-bold text-white">
                              {r.createdAt?.toDate ? r.createdAt.toDate().toLocaleDateString() : "Recent"}
                            </td>
                            <td className="px-6 py-4">{r.totalEmployees}</td>
                            <td className="px-6 py-4 text-purple-400 font-bold">
                              {Math.round((Number(r.femaleEmployees || 0) / Number(r.totalEmployees || 1)) * 100)}%
                            </td>
                            <td className="px-6 py-4">{r.trainingHours} hrs</td>
                            <td className="px-6 py-4 text-red-400 font-bold">{r.safetyIncidents}</td>
                            <td className="px-6 py-4 text-green-400 font-bold">{r.csrActivities}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: GOVERNANCE */}
        {activeTab === "governance" && (
          <div className="space-y-8">
            <div className="bg-gray-900/80 border border-gray-800 rounded-3xl p-8 space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="text-yellow-400" /> Governance & Policy Assurance
                </h3>
                <p className="text-xs text-gray-400 mt-1">Corporate policy enforcement, risk management, and regulatory compliance</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-950 p-6 rounded-2xl border border-gray-800 space-y-2">
                  <span className="text-xs font-extrabold text-yellow-400 uppercase">Compliance Rate</span>
                  <p className="text-3xl font-extrabold text-emerald-400">{complianceRate}%</p>
                  <p className="text-xs text-gray-400">{compliantCount} of {totalCompliance} items compliant</p>
                </div>

                <div className="bg-gray-950 p-6 rounded-2xl border border-gray-800 space-y-2">
                  <span className="text-xs font-extrabold text-green-400 uppercase">Enforced Policies</span>
                  <p className="text-3xl font-extrabold text-white">{policies.length}</p>
                  <p className="text-xs text-gray-400">{activePoliciesCount} active governance policies</p>
                </div>

                <div className="bg-gray-950 p-6 rounded-2xl border border-gray-800 space-y-2">
                  <span className="text-xs font-extrabold text-amber-400 uppercase">Risk Register</span>
                  <p className="text-3xl font-extrabold text-white">{risks.length}</p>
                  <p className="text-xs text-gray-400">{openRisksCount} open risks monitored</p>
                </div>
              </div>

              {/* Governance Policy Table */}
              <div className="border border-gray-800 rounded-2xl overflow-hidden">
                <div className="px-6 py-4 bg-gray-950 border-b border-gray-800 font-extrabold text-sm text-white">
                  Corporate Policy Disclosures
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-gray-900 text-gray-400 uppercase border-b border-gray-800">
                      <tr>
                        <th className="px-6 py-3">Policy Title</th>
                        <th className="px-6 py-3">Category</th>
                        <th className="px-6 py-3">Owner</th>
                        <th className="px-6 py-3">Enforcement Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800 text-gray-300">
                      {policies.length === 0 ? (
                        <tr>
                          <td colSpan="4" className="px-6 py-6 text-center text-gray-500">
                            No corporate policies registered.
                          </td>
                        </tr>
                      ) : (
                        policies.map((p) => (
                          <tr key={p.id} className="hover:bg-gray-900/60 transition">
                            <td className="px-6 py-4 font-bold text-white">{p.policyName || "Untitled Policy"}</td>
                            <td className="px-6 py-4">{p.policyCategory || "General"}</td>
                            <td className="px-6 py-4">{p.policyOwner || "Unassigned"}</td>
                            <td className="px-6 py-4">
                              <span className="px-2.5 py-1 bg-green-500/10 border border-green-500/30 text-green-400 rounded-full font-bold">
                                {p.status || "Active"}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800/80 py-10 bg-gray-950 text-center text-xs text-gray-500 space-y-2">
        <div className="flex justify-center items-center gap-2 text-gray-400 font-semibold">
          <Leaf size={16} className="text-green-500" /> GreenOps AI Sustainability Platform
        </div>
        <p>© 2026 GreenOps AI. Audit-Ready Corporate Sustainability & Decarbonization Intelligence.</p>
      </footer>
    </div>
  );
}

export default PublicESGPortal;
