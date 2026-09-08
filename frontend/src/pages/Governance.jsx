import Sidebar from "../components/Sidebar";
import GovernancePolicyModal from "../components/GovernancePolicyModal";
import GovernanceRiskModal from "../components/GovernanceRiskModal";
import GovernanceAuditModal from "../components/GovernanceAuditModal";
import GovernanceComplianceModal from "../components/GovernanceComplianceModal";
import { useEffect, useState } from "react";
import { db } from "../config/firebase";
import { useTheme } from "../context/ThemeContext";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import toast from "react-hot-toast";
import { Download } from "lucide-react";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
} from "recharts";
import {
  collection,
  addDoc,
  onSnapshot,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";

function Governance() {
  const { darkMode } = useTheme();
  const [showPolicyModal, setShowPolicyModal] = useState(false);

  const [showRiskModal, setShowRiskModal] = useState(false);
  const [policies, setPolicies] = useState([]);
  const [risks, setRisks] = useState([]);

  const [showAuditModal, setShowAuditModal] = useState(false);
  const [selectedAudit, setSelectedAudit] = useState(null);
  const [selectedAuditView, setSelectedAuditView] = useState(null);

  const [showComplianceModal, setShowComplianceModal] = useState(false);
  const [selectedCompliance, setSelectedCompliance] = useState(null);
  const [selectedComplianceView, setSelectedComplianceView] = useState(null);

  const [audits, setAudits] = useState([]);
  const [complianceItems, setComplianceItems] = useState([]);

  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [toastNotice, setToastNotice] = useState(null);

  const [auditSearch, setAuditSearch] = useState("");
  const [auditStatusFilter, setAuditStatusFilter] = useState("All");
  const [auditTypeFilter, setAuditTypeFilter] = useState("All");
  const [auditPage, setAuditPage] = useState(1);
  const auditRowsPerPage = 10;

  const [complianceSearch, setComplianceSearch] = useState("");
  const [complianceStatusFilter, setComplianceStatusFilter] = useState("All");
  const [complianceFrameworkFilter, setComplianceFrameworkFilter] = useState("All");
  const [compliancePage, setCompliancePage] = useState(1);
  const complianceRowsPerPage = 10;

  useEffect(() => {
    const unsubscribeAudits = onSnapshot(
      collection(db, "governanceAudits"),
      (snapshot) => {
        const auditData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAudits(auditData);
      }
    );

    const unsubscribeCompliance = onSnapshot(
      collection(db, "governanceCompliance"),
      (snapshot) => {
        const complianceData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setComplianceItems(complianceData);
      }
    );

    const unsubscribePolicies = onSnapshot(
      collection(db, "governancePolicies"),
      (snapshot) => {
        setPolicies(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      }
    );

    const unsubscribeRisks = onSnapshot(
      collection(db, "governanceRisks"),
      (snapshot) => {
        setRisks(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      }
    );

    return () => {
      unsubscribeAudits();
      unsubscribeCompliance();
      unsubscribePolicies();
      unsubscribeRisks();
    };
  }, []);

    const filteredComplianceItems = complianceItems.filter((item) => {
    const matchesSearch =
      item.requirementName
        ?.toLowerCase()
        .includes(complianceSearch.toLowerCase()) ||
      item.owner
        ?.toLowerCase()
        .includes(complianceSearch.toLowerCase());

    const matchesStatus =
      complianceStatusFilter === "All" ||
      item.status === complianceStatusFilter;

    const matchesFramework =
      complianceFrameworkFilter === "All" ||
      item.framework === complianceFrameworkFilter;

    return matchesSearch && matchesStatus && matchesFramework;
  });

  const complianceTotalPages = Math.max(
    1,
    Math.ceil(
      filteredComplianceItems.length / complianceRowsPerPage
    )
  );

  const paginatedComplianceItems = filteredComplianceItems.slice(
    (compliancePage - 1) * complianceRowsPerPage,
    compliancePage * complianceRowsPerPage
  );

    const filteredAudits = audits.filter((audit) => {
    const matchesSearch =
      audit.auditName
        ?.toLowerCase()
        .includes(auditSearch.toLowerCase()) ||
      audit.auditOwner
        ?.toLowerCase()
        .includes(auditSearch.toLowerCase());

    const matchesStatus =
      auditStatusFilter === "All" ||
      audit.status === auditStatusFilter;

    const matchesType =
      auditTypeFilter === "All" ||
      audit.auditType === auditTypeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const auditTotalPages = Math.max(
    1,
    Math.ceil(
      filteredAudits.length / auditRowsPerPage
    )
  );

  const paginatedAudits = filteredAudits.slice(
    (auditPage - 1) * auditRowsPerPage,
    auditPage * auditRowsPerPage
  );


  // Dynamic Governance Health & Radar Scores
  const totalCompliance = complianceItems.length;
  const compliantCount = complianceItems.filter((item) => item.status === "Compliant").length;
  const complianceScore = totalCompliance > 0
    ? Math.round((compliantCount / totalCompliance) * 100)
    : 88;

  const totalPolicies = policies.length;
  const activePoliciesCount = policies.filter((p) => p.status === "Active" || !p.status).length;
  const policyScore = totalPolicies > 0
    ? Math.round((activePoliciesCount / totalPolicies) * 100)
    : 90;

  const totalRisks = risks.length;
  const highRisksCount = risks.filter((r) => r.severity === "High" || r.severity === "Critical").length;
  const riskScore = totalRisks > 0
    ? Math.max(0, Math.round(((totalRisks - highRisksCount) / totalRisks) * 100))
    : 78;

  const totalAudits = audits.length;
  const completedAuditsCount = audits.filter((a) => a.status === "Completed" || a.status === "Compliant").length;
  const auditScore = totalAudits > 0
    ? Math.min(100, Math.round(((completedAuditsCount + 1) / (totalAudits + 1)) * 95))
    : 82;

  const ethicsScore = Math.round((policyScore * 0.5) + (complianceScore * 0.5));

  const overallGovernanceScore = Math.round(
    (complianceScore + policyScore + riskScore + auditScore + ethicsScore) / 5
  );

  const healthStatus = overallGovernanceScore >= 80
    ? { label: "Healthy", bg: "bg-green-50 dark:bg-green-950/50", text: "text-green-700 dark:text-green-300" }
    : overallGovernanceScore >= 60
    ? { label: "Moderate", bg: "bg-yellow-50 dark:bg-yellow-950/50", text: "text-yellow-700 dark:text-yellow-300" }
    : { label: "Needs Attention", bg: "bg-red-50 dark:bg-red-950/50", text: "text-red-700 dark:text-red-300" };

  const radarChartData = [
    { subject: "Board Governance", score: policyScore, fullMark: 100 },
    { subject: "Compliance", score: complianceScore, fullMark: 100 },
    { subject: "Risk Management", score: riskScore, fullMark: 100 },
    { subject: "Audit Readiness", score: auditScore, fullMark: 100 },
    { subject: "Ethics & Transparency", score: ethicsScore, fullMark: 100 },
  ];

  const handleExportReport = () => {
    try {
      const doc = new jsPDF();

      // Title & Header
      doc.setFontSize(20);
      doc.setFont("helvetica", "bold");
      doc.text("GreenOps AI - Governance & Compliance Report", 14, 20);

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(
        `Generated on: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()} | Status: Audit-Ready`,
        14,
        28
      );

      // Section 1: Executive Summary / Governance Health
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("1. Governance Health Summary", 14, 40);

      autoTable(doc, {
        startY: 45,
        head: [["Metric", "Value", "Description"]],
        body: [
          ["Governance Score", `${overallGovernanceScore}%`, "Overall compliance & maturity percentage"],
          ["Active Policies", policies.length.toString(), "Policies registered & enforced"],
          ["Open Risks", risks.length.toString(), "Risks tracked requiring oversight"],
          ["Compliance Requirements", complianceItems.length.toString(), "Regulatory compliance items"],
          ["Scheduled Audits", audits.length.toString(), "Upcoming & active audit schedules"],
        ],
        theme: "striped",
        headStyles: { fillColor: [22, 163, 74] },
      });

      let currentY = doc.lastAutoTable.finalY + 15;

      // Section 2: Active Policies
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("2. Active Governance Policies", 14, currentY);

      const policyBody = policies.length > 0
        ? policies.map((p) => [
            p.policyName || "Untitled Policy",
            p.policyCategory || "General",
            p.policyOwner || "Unassigned",
            p.status || "Active",
          ])
        : [["No active policies found", "-", "-", "-"]];

      autoTable(doc, {
        startY: currentY + 5,
        head: [["Policy Name", "Category", "Owner", "Status"]],
        body: policyBody,
        theme: "grid",
        headStyles: { fillColor: [22, 163, 74] },
      });

      currentY = doc.lastAutoTable.finalY + 15;

      if (currentY > 230) {
        doc.addPage();
        currentY = 20;
      }

      // Section 3: Risk Register
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("3. Enterprise Risk Register", 14, currentY);

      const riskBody = risks.length > 0
        ? risks.map((r) => [
            r.riskTitle || "Untitled Risk",
            r.riskCategory || "Operational",
            r.severity || "Medium",
            r.impact || "Moderate",
            r.status || "Open",
          ])
        : [["No open risks found", "-", "-", "-", "-"]];

      autoTable(doc, {
        startY: currentY + 5,
        head: [["Risk Title", "Category", "Severity", "Impact", "Status"]],
        body: riskBody,
        theme: "grid",
        headStyles: { fillColor: [217, 119, 6] },
      });

      currentY = doc.lastAutoTable.finalY + 15;

      if (currentY > 220) {
        doc.addPage();
        currentY = 20;
      }

      // Section 4: Compliance Requirements
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("4. Compliance & Regulatory Requirements", 14, currentY);

      const complianceBody = complianceItems.length > 0
        ? complianceItems.map((c) => [
            c.requirementName || "Untitled Requirement",
            c.framework || "BRSR",
            c.owner || "Unassigned",
            c.status || "In Progress",
            c.dueDate || "-",
          ])
        : [["No compliance records found", "-", "-", "-", "-"]];

      autoTable(doc, {
        startY: currentY + 5,
        head: [["Requirement", "Framework", "Owner", "Status", "Due Date"]],
        body: complianceBody,
        theme: "grid",
        headStyles: { fillColor: [37, 99, 235] },
      });

      doc.save(`GreenOps_AI_Governance_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
      toast.success("Governance report exported successfully!");
    } catch (error) {
      console.error("Export report error:", error);
      toast.error("Failed to export governance report.");
    }
  };

return (
    <div className={`flex min-h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>
      <Sidebar />

      {/* Top Fixed Header Navbar */}
      <div className={`fixed top-0 left-64 right-0 border-b z-40 ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
        <div className="px-10 py-6 flex justify-between items-center">
          <div>
            <h1 className={`text-4xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
              Governance Management
            </h1>
            <p className={`mt-2 text-lg ${darkMode ? "text-gray-300" : "text-gray-500"}`}>
              Enterprise governance, risk and compliance oversight.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Live System Badge */}
            <div className={`hidden md:flex items-center gap-3 px-5 py-2 rounded-full shadow-lg ${
              darkMode
                ? "bg-green-900/30 border border-green-700 text-green-400 shadow-green-900/20"
                : "bg-green-50 border border-green-300 text-green-700 shadow-green-200/60"
            }`}>
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-600"></span>
              </span>
              <span className={`font-semibold ${darkMode ? "text-green-400" : "text-green-700"}`}>
                Live System
              </span>
            </div>

            {/* Export Report Button */}
            <button
              type="button"
              onClick={handleExportReport}
              className="px-5 py-2 rounded-full bg-green-600 hover:bg-green-700 text-white text-sm font-semibold transition flex items-center gap-2 shadow-md cursor-pointer"
            >
              <Download size={18} />
              Export Report
            </button>
          </div>
        </div>
      </div>

      <main className="flex-1 ml-64 p-10 pt-40 space-y-8">

        {/* Governance Health */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Governance Health
              </h2>

              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                High-level view of your governance posture.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

            {/* Governance Score */}
            <div className={`border rounded-2xl p-6 shadow-sm hover:shadow-md transition ${darkMode ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-200 text-gray-900"}`}>
              <p className={`text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                Governance Score
              </p>

              <div className="flex items-end justify-between mt-4">
                <p className={`text-4xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
                  {overallGovernanceScore}%
                </p>

                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${healthStatus.bg} ${healthStatus.text}`}>
                  {healthStatus.label}
                </span>
              </div>

              <p className="text-xs text-gray-400 dark:text-gray-400 mt-3">
                Overall governance maturity
              </p>
            </div>

            {/* Policies */}
            <div className={`border rounded-2xl p-6 shadow-sm hover:shadow-md transition ${darkMode ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-200 text-gray-900"}`}>
              <p className={`text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                Policies
              </p>

              <p className={`text-4xl font-bold mt-4 ${darkMode ? "text-white" : "text-gray-900"}`}>
                {policies.length}
              </p>

              <p className="text-xs text-gray-400 dark:text-gray-400 mt-3">
                {activePoliciesCount} active policies enforced
              </p>
            </div>

            {/* Risks */}
            <div className={`border rounded-2xl p-6 shadow-sm hover:shadow-md transition ${darkMode ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-200 text-gray-900"}`}>
              <p className={`text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                Open Risks
              </p>

              <p className={`text-4xl font-bold mt-4 ${darkMode ? "text-white" : "text-gray-900"}`}>
                {risks.length}
              </p>

              <p className="text-xs text-gray-400 dark:text-gray-400 mt-3">
                {highRisksCount > 0 ? `${highRisksCount} high severity open` : "Risks monitored"}
              </p>
            </div>

            {/* Compliance */}
            <div className={`border rounded-2xl p-6 shadow-sm hover:shadow-md transition ${darkMode ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-200 text-gray-900"}`}>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Compliance
              </p>

              <p className="text-4xl font-bold text-gray-900 dark:text-white mt-4">
                {complianceScore}%
              </p>

              <p className="text-xs text-gray-400 dark:text-gray-400 mt-3">
                {compliantCount} of {complianceItems.length} requirements compliant
              </p>
            </div>

          </div>
        </section>

        {/* Compliance & Audit Timeline Roadmap */}
        <section className={`mt-8 border rounded-2xl p-7 shadow-sm ${darkMode ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-200 text-gray-900"}`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <span className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
                Regulatory Roadmap
              </span>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                Compliance Timeline & Audit Schedule
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Key upcoming regulatory audit dates, policy reviews, and submission deadlines.
              </p>
            </div>
            <span className="self-start sm:self-center px-3.5 py-1.5 bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 font-semibold rounded-full text-xs border border-purple-200 dark:border-purple-800">
              🗓 Q3 - Q4 Schedule
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative before:hidden md:before:block md:before:absolute md:before:top-1/2 md:before:left-6 md:before:right-6 md:before:h-1 md:before:bg-gray-200 md:before:dark:bg-gray-700 md:before:-z-0">
            {[
              {
                date: "Sep 15, 2026",
                title: "BRSR Annual Filing",
                framework: "SEBI Standard",
                status: "Upcoming",
                color: "bg-blue-500",
              },
              {
                date: "Oct 01, 2026",
                title: "ISO 14001 Recertification",
                framework: "Environmental Audit",
                status: "In Preparation",
                color: "bg-purple-500",
              },
              {
                date: "Nov 20, 2026",
                title: "CSRD EU Disclosures",
                framework: "EU Taxonomy",
                status: "Planned",
                color: "bg-amber-500",
              },
              {
                date: "Dec 31, 2026",
                title: "Annual Carbon True-Up",
                framework: "Net-Zero Pathway",
                status: "Scheduled",
                color: "bg-emerald-500",
              },
            ].map((event, idx) => (
              <div
                key={idx}
                className="bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-700 rounded-xl p-5 relative z-10 hover:shadow-md transition hover:-translate-y-0.5"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className={`w-3 h-3 rounded-full ${event.color}`} />
                  <span className="text-[11px] font-bold text-gray-400 dark:text-gray-400">
                    {event.date}
                  </span>
                </div>
                <h4 className="font-bold text-gray-900 dark:text-white text-base mb-1">
                  {event.title}
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">{event.framework}</p>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300">
                  {event.status}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Main Dashboard Area */}
        <section className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-6">

          {/* Radar Chart Card */}
          <div className={`xl:col-span-2 border rounded-2xl p-7 shadow-sm ${darkMode ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-200 text-gray-900"}`}>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <p className="text-sm font-semibold text-green-600 dark:text-green-400 uppercase tracking-wider">
                  Governance Performance
                </p>

                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  Governance Maturity
                </h2>

                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Performance across key governance dimensions.
                </p>
              </div>

              <span className="px-3 py-1.5 rounded-full text-xs font-extrabold bg-green-500/10 text-green-700 dark:bg-green-500/20 dark:text-green-300 border border-green-500/30 self-start sm:self-center">
                Maturity Index: {overallGovernanceScore}/100
              </span>
            </div>

            <div className="mt-6 h-[380px] w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarChartData}>
                  <PolarGrid stroke={darkMode ? "#4b5563" : "#d1d5db"} strokeWidth={1.5} />
                  <PolarAngleAxis
                    dataKey="subject"
                    tick={{ fill: darkMode ? "#ffffff" : "#111827", fontSize: 13, fontWeight: 700 }}
                  />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} stroke={darkMode ? "#6b7280" : "#9ca3af"} tick={{ fill: darkMode ? "#9ca3af" : "#6b7280", fontSize: 11, fontWeight: 600 }} />
                  <Radar
                    name="Maturity Score"
                    dataKey="score"
                    stroke={darkMode ? "#34d399" : "#059669"}
                    strokeWidth={3}
                    fill={darkMode ? "#10b981" : "#10b981"}
                    fillOpacity={darkMode ? 0.45 : 0.35}
                    dot={{ r: 5, fill: darkMode ? "#34d399" : "#059669", stroke: darkMode ? "#064e3b" : "#ffffff", strokeWidth: 2 }}
                  />
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: darkMode ? "#111827" : "#ffffff",
                      borderColor: darkMode ? "#10b981" : "#059669",
                      borderRadius: "0.75rem",
                      color: darkMode ? "#ffffff" : "#111827",
                      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.5)",
                      fontWeight: 600,
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Metric Pills Legend */}
            <div className="flex flex-wrap items-center justify-center gap-3 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700/60">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-500/10 text-green-700 dark:text-green-300 border border-green-500/20">
                Board Governance: {policyScore}%
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500/20">
                Compliance: {complianceScore}%
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20">
                Risk Management: {riskScore}%
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20">
                Audit Readiness: {auditScore}%
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/20">
                Ethics: {ethicsScore}%
              </span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className={`border rounded-2xl p-7 shadow-sm ${darkMode ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-200 text-gray-900"}`}>

            <p className="text-sm font-semibold text-green-600 dark:text-green-400 uppercase tracking-wider">
              Platform Tools
            </p>

            <h2 className="text-2xl font-bold mt-1 text-gray-900 dark:text-white">
              Quick Actions
            </h2>

            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Create and manage governance activities.
            </p>

            <div className="grid grid-cols-2 gap-3 mt-7">

              <button
                onClick={() => setShowRiskModal(true)}
                type="button"
                className="min-h-[120px] rounded-2xl border border-gray-200 dark:border-amber-500/30 bg-gray-50 hover:bg-gray-100 dark:bg-amber-500/10 dark:hover:bg-amber-500/20 transition p-4 text-left group"
              >
                <div className="text-2xl mb-5 text-amber-500 group-hover:scale-110 transition-transform">
                  ⚠
                </div>

                <p className="text-xs font-bold tracking-wider text-gray-800 dark:text-amber-300">
                  ADD RISK
                </p>
              </button>

             <button
                type="button"
                onClick={() => setShowPolicyModal(true)}
                className="min-h-[120px] rounded-2xl border border-gray-200 dark:border-emerald-500/30 bg-gray-50 hover:bg-gray-100 dark:bg-emerald-500/10 dark:hover:bg-emerald-500/20 transition p-4 text-left group"
              >
                <div className="text-2xl mb-5 text-emerald-500 group-hover:scale-110 transition-transform">
                  ✓
                </div>

                <p className="text-xs font-bold tracking-wider text-gray-800 dark:text-emerald-300">
                  ADD POLICY
                </p>
              </button>

              <button
                onClick={() => setShowAuditModal(true)}
                type="button"
                className="min-h-[120px] rounded-2xl border border-gray-200 dark:border-blue-500/30 bg-gray-50 hover:bg-gray-100 dark:bg-blue-500/10 dark:hover:bg-blue-500/20 transition p-4 text-left group"
              >
                <div className="text-2xl mb-5 text-blue-500 group-hover:scale-110 transition-transform">
                  ◉
                </div>

                <p className="text-xs font-bold tracking-wider text-gray-800 dark:text-blue-300">
                  START AUDIT
                </p>
              </button>

              <button
                onClick={() => setShowComplianceModal(true)}
                type="button"
                className="min-h-[120px] rounded-2xl border border-gray-200 dark:border-purple-500/30 bg-gray-50 hover:bg-gray-100 dark:bg-purple-500/10 dark:hover:bg-purple-500/20 transition p-4 text-left group"
              >
                <div className="text-2xl mb-5 text-purple-500 group-hover:scale-110 transition-transform">
                  ▣
                </div>

                <p className="text-xs font-bold tracking-wider text-gray-800 dark:text-purple-300">
                  COMPLIANCE
                </p>
              </button>

            </div>
          </div>

        </section>

        {/* Compliance Status */}
        <section className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-6">

          <div className={`xl:col-span-2 border rounded-2xl p-7 shadow-sm ${darkMode ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-200 text-gray-900"}`}>

            <div className="flex items-start justify-between gap-4">

              <div>
                <p className="text-sm font-semibold text-green-600 dark:text-green-400 uppercase tracking-wider">
                  Compliance
                </p>

                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  Compliance Status
                </h2>

                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Live readiness across governance requirements.
                </p>
              </div>

              <button
                type="button"
                className="text-sm font-semibold text-green-700 dark:text-green-400 hover:text-green-800"
              >
                Full Report →
              </button>

            </div>

            <div className="mt-7 space-y-5">
              {complianceItems.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 p-8 text-center">
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  No compliance requirements yet
                </p>

                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Add a compliance requirement to start tracking readiness.
                </p>
              </div>
            ) : (
              Array.from(
                new Set(
                  complianceItems.map((item) => item.framework)
                )
              ).map((framework) => {
                const frameworkItems = complianceItems.filter(
                  (item) => item.framework === framework
                );

                const compliantItems = frameworkItems.filter(
                  (item) =>
                    String(item.status || "").toLowerCase() === "compliant"
                );

                const percentage = Math.round(
                  (compliantItems.length / frameworkItems.length) * 100
                );

                return (
                  <div key={framework}>

                    <div className="flex items-center justify-between text-sm mb-2">

                      <span className="font-medium text-gray-600 dark:text-gray-300">
                        {framework}
                      </span>

                      <span className="font-bold text-gray-900 dark:text-white">
                        {percentage}%
                      </span>

                    </div>

                    <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">

                      <div
                        className="h-full bg-green-500 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />

                    </div>

                    <p className="text-xs text-gray-400 dark:text-gray-400 mt-1">
                      {compliantItems.length} of {frameworkItems.length} requirements compliant
                    </p>

                  </div>
                );
              })
            )}

          </div>

          </div>

          {/* Attention Required */}
          <div className={`border rounded-2xl p-7 shadow-sm ${darkMode ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-200 text-gray-900"}`}>

            <p className="text-sm font-semibold text-red-600 dark:text-red-400 uppercase tracking-wider">
              Action Center
            </p>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              Attention Required
            </h2>

            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Items requiring management attention.
            </p>

            <div className="mt-6 space-y-3">
              {complianceItems.filter(
              (item) =>
                item.status === "Due Soon" ||
                item.status === "Non-Compliant" ||
                item.status === "Under Review"
            ).length === 0 ? (
              <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                <p className="text-sm font-semibold text-gray-800 dark:text-white">
                  No critical items
                </p>

                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Governance alerts will appear here.
                </p>
              </div>
            ) : (
              complianceItems
                .filter(
                  (item) =>
                    item.status === "Due Soon" ||
                    item.status === "Non-Compliant" ||
                    item.status === "Under Review"
                )
                .slice(0, 4)
                .map((item) => (
                  <div
                    key={item.id}
                    className="rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
                  >
                    <div className="flex items-start justify-between gap-3">

                      <div>
                        <p className="text-sm font-semibold text-gray-800 dark:text-white">
                          {item.requirementName}
                        </p>

                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {item.framework} · {item.owner}
                        </p>
                      </div>

                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          item.status === "Non-Compliant"
                            ? "bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-300"
                            : item.status === "Due Soon"
                            ? "bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300"
                            : "bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300"
                        }`}
                      >
                        {item.status}
                      </span>

                    </div>

                    {item.dueDate && (
                      <p className="text-xs text-gray-400 dark:text-gray-400 mt-3">
                        Due: {item.dueDate}
                      </p>
                    )}
                  </div>
                ))
            )}
              

          </div>

        </div>

        </section>

        {showPolicyModal && (
          <GovernancePolicyModal
            onClose={() => setShowPolicyModal(false)}
            onSave={() => {
              setShowPolicyModal(false);
            }}
          />
        )}

        {showRiskModal && (
          <GovernanceRiskModal
            onClose={() => setShowRiskModal(false)}
            onSave={() => {
              setShowRiskModal(false);
            }}
          />
        )}

        {showAuditModal && (
         <GovernanceAuditModal
            audit={selectedAudit}
            onClose={() => {
              setShowAuditModal(false);
              setSelectedAudit(null);
            }}
           onSave={async (data) => {
  try {
    if (selectedAudit) {
      await updateDoc(
        doc(
          db,
          "governanceAudits",
          selectedAudit.id
        ),
        data
      );
    } else {
      await addDoc(
        collection(db, "governanceAudits"),
        data
      );
    }

    setShowAuditModal(false);
    setSelectedAudit(null);

  } catch (error) {
    console.error("Error saving audit:", error);
    alert("Failed to save audit.");
  }
}}
          />
        )}

    {showComplianceModal && (

  <GovernanceComplianceModal
    policy={selectedCompliance}

    onClose={() => {
      setShowComplianceModal(false);
      setSelectedCompliance(null);
    }}

    onSave={async (data) => {

      try {

        if (selectedCompliance) {

          await updateDoc(
            doc(
              db,
              "governanceCompliance",
              selectedCompliance.id
            ),
            data
          );

        } else {

          await addDoc(
            collection(db, "governanceCompliance"),
            data
          );

        }

        setShowComplianceModal(false);
        setSelectedCompliance(null);

      } catch (error) {

        console.error("Error saving compliance:", error);
        alert("Failed to save compliance requirement.");

      }

    }}

    
  />

)}
{selectedComplianceView && (
  <div
    className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs"
    onClick={() => setSelectedComplianceView(null)}
  >
    <div
      className="w-full max-w-xl h-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-2xl overflow-y-auto border-l border-gray-200 dark:border-gray-700"
      onClick={(e) => e.stopPropagation()}
    >

      {/* Header */}

      <div className="flex items-start justify-between p-7 border-b border-gray-200 dark:border-gray-700">

        <div>

          <p className="text-sm font-semibold text-green-600 dark:text-green-400 uppercase tracking-wider">
            Compliance
          </p>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            Requirement Details
          </h2>

          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Review compliance requirement information.
          </p>

        </div>

        <button
          type="button"
          onClick={() => setSelectedComplianceView(null)}
          className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 text-xl flex items-center justify-center"
        >
          ×
        </button>

      </div>


      {/* Content */}

      <div className="p-7">

        <div className="rounded-2xl bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700 p-6">

          <div className="flex items-start justify-between gap-4">

            <div>

              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Requirement
              </p>

              <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-2">
                {selectedComplianceView.requirementName}
              </h3>

            </div>

            <span
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${
                selectedComplianceView.status === "Compliant"
                  ? "bg-green-50 dark:bg-green-950/50 text-green-700 dark:text-green-300"
                  : selectedComplianceView.status === "Due Soon"
                  ? "bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300"
                  : selectedComplianceView.status === "Non-Compliant"
                  ? "bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-300"
                  : "bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300"
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current" />
              {selectedComplianceView.status || "Unknown"}
            </span>

          </div>


          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-7">

            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Framework
              </p>

              <p className="text-sm font-semibold text-gray-800 dark:text-white mt-1">
                {selectedComplianceView.framework || "—"}
              </p>
            </div>


            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Owner
              </p>

              <p className="text-sm font-semibold text-gray-800 dark:text-white mt-1">
                {selectedComplianceView.owner || "—"}
              </p>
            </div>


            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Due Date
              </p>

              <p className="text-sm font-semibold text-gray-800 dark:text-white mt-1">
                {selectedComplianceView.dueDate || "—"}
              </p>
            </div>


            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Status
              </p>

              <p className="text-sm font-semibold text-gray-800 dark:text-white mt-1">
                {selectedComplianceView.status || "—"}
              </p>
            </div>

          </div>

        </div>


        {/* Actions */}

        <div className="flex gap-3 mt-6">

          <button
            type="button"
            onClick={() => {
              setSelectedCompliance(selectedComplianceView);
              setSelectedComplianceView(null);
              setShowComplianceModal(true);
            }}
            className="flex-1 px-5 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition"
          >
            Edit Requirement
          </button>

          <button
            type="button"
            onClick={() => setSelectedComplianceView(null)}
            className="px-5 py-3 border border-gray-200 dark:border-gray-700 rounded-xl font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
          >
            Close
          </button>

        </div>

      </div>

    </div>
  </div>
)}

{selectedAuditView && (
  <div
    className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs"
    onClick={() => setSelectedAuditView(null)}
  >
    <div
      className="w-full max-w-xl h-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-2xl overflow-y-auto border-l border-gray-200 dark:border-gray-700"
      onClick={(e) => e.stopPropagation()}
    >

      {/* Header */}

      <div className="flex items-start justify-between p-7 border-b border-gray-200 dark:border-gray-700">

        <div>

          <p className="text-sm font-semibold text-green-600 dark:text-green-400 uppercase tracking-wider">
            Audit & Assurance
          </p>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            Audit Details
          </h2>

          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Review audit information and progress.
          </p>

        </div>

        <button
          type="button"
          onClick={() => setSelectedAuditView(null)}
          className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 text-xl flex items-center justify-center"
        >
          ×
        </button>

      </div>


      {/* Content */}

      <div className="p-7">

        <div className="rounded-2xl bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700 p-6">

          <div className="flex items-start justify-between gap-4">

            <div>

              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Audit
              </p>

              <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-2">
                {selectedAuditView.auditName}
              </h3>

            </div>

            <span
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${
                selectedAuditView.status === "Completed"
                  ? "bg-green-50 dark:bg-green-950/50 text-green-700 dark:text-green-300"
                  : selectedAuditView.status === "In Progress"
                  ? "bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300"
                  : selectedAuditView.status === "On Hold"
                  ? "bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-300"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current" />
              {selectedAuditView.status || "Planned"}
            </span>

          </div>


          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-7">

            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Audit Type
              </p>

              <p className="text-sm font-semibold text-gray-800 dark:text-white mt-1">
                {selectedAuditView.auditType || "—"}
              </p>
            </div>


            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Audit Owner
              </p>

              <p className="text-sm font-semibold text-gray-800 dark:text-white mt-1">
                {selectedAuditView.auditOwner || "—"}
              </p>
            </div>


            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Start Date
              </p>

              <p className="text-sm font-semibold text-gray-800 dark:text-white mt-1">
                {selectedAuditView.startDate || "—"}
              </p>
            </div>


            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Target Date
              </p>

              <p className="text-sm font-semibold text-gray-800 dark:text-white mt-1">
                {selectedAuditView.targetDate || "—"}
              </p>
            </div>


            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Status
              </p>

              <p className="text-sm font-semibold text-gray-800 dark:text-white mt-1">
                {selectedAuditView.status || "—"}
              </p>
            </div>

          </div>

        </div>


        {/* Actions */}

        <div className="flex gap-3 mt-6">

          <button
            type="button"
            onClick={() => {
              setSelectedAudit(selectedAuditView);
              setSelectedAuditView(null);
              setShowAuditModal(true);
            }}
            className="flex-1 px-5 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition"
          >
            Edit Audit
          </button>

          <button
            type="button"
            onClick={() => setSelectedAuditView(null)}
            className="px-5 py-3 border border-gray-200 dark:border-gray-700 rounded-xl font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
          >
            Close
          </button>

        </div>

      </div>

    </div>
  </div>
)}


       {/* Compliance Management */}

        <section className="mt-8">

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-5">

            <div>
              <p className="text-sm font-semibold text-green-600 dark:text-green-400 uppercase tracking-wider">
                Compliance Management
              </p>

              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                Compliance Requirements
              </h2>

              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Monitor regulatory requirements, owners, deadlines and compliance status.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowComplianceModal(true)}
              className="px-5 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition"
            >
              + Add Requirement
            </button>

          </div>

                    {/* Compliance Controls */}

          <div className={`border rounded-2xl shadow-sm p-4 mb-4 ${darkMode ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-200 text-gray-900"}`}>

            <div className="flex flex-col xl:flex-row gap-3">

              {/* Search */}

              <div className="relative flex-1">

                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  ⌕
                </span>

                <input
                  type="text"
                  value={complianceSearch}
                  onChange={(e) => {
                    setComplianceSearch(e.target.value);
                    setCompliancePage(1);
                  }}
                  placeholder="Search requirements or owners..."
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-700 dark:text-white outline-none focus:bg-white dark:focus:bg-gray-900 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                />

              </div>


              {/* Status Filter */}

              <select
                value={complianceStatusFilter}
                onChange={(e) => {
                  setComplianceStatusFilter(e.target.value);
                  setCompliancePage(1);
                }}
                className="xl:w-48 px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium text-gray-700 dark:text-white outline-none focus:bg-white dark:focus:bg-gray-900 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
              >

                <option value="All">
                  All Statuses
                </option>

                <option value="Compliant">
                  Compliant
                </option>

                <option value="Due Soon">
                  Due Soon
                </option>

                <option value="Non-Compliant">
                  Non-Compliant
                </option>

                <option value="Under Review">
                  Under Review
                </option>

              </select>


              {/* Framework Filter */}

              <select
                value={complianceFrameworkFilter}
                onChange={(e) => {
                  setComplianceFrameworkFilter(e.target.value);
                  setCompliancePage(1);
                }}
                className="xl:w-48 px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium text-gray-700 dark:text-white outline-none focus:bg-white dark:focus:bg-gray-900 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
              >

                <option value="All">
                  All Frameworks
                </option>

                <option value="GRI">
                  GRI
                </option>

                <option value="SASB">
                  SASB
                </option>

                <option value="ISSB">
                  ISSB
                </option>

                <option value="BRSR">
                  BRSR
                </option>

                <option value="SEBI">
                  SEBI
                </option>

                <option value="Internal">
                  Internal
                </option>

              </select>


              {/* Reset */}

              {(complianceSearch ||
                complianceStatusFilter !== "All" ||
                complianceFrameworkFilter !== "All") && (

                <button
                  type="button"
                  onClick={() => {
                    setComplianceSearch("");
                    setComplianceStatusFilter("All");
                    setComplianceFrameworkFilter("All");
                    setCompliancePage(1);
                  }}
                  className="px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                >
                  Reset
                </button>

              )}

            </div>

          </div>


          {/* Compliance Table */}

          <div className={`border rounded-2xl shadow-sm overflow-hidden ${darkMode ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-200 text-gray-900"}`}>

            {complianceItems.length === 0 ? (

              <div className="p-12 text-center">

                <div className="w-14 h-14 mx-auto rounded-2xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-400 dark:text-gray-300 text-2xl">
                  ✓
                </div>

                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-4">
                  No compliance requirements
                </h3>

                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Add your first compliance requirement to start tracking readiness.
                </p>

                <button
                  type="button"
                  onClick={() => setShowComplianceModal(true)}
                  className="mt-5 px-5 py-2.5 bg-green-600 text-white rounded-xl text-sm font-semibold hover:bg-green-700 transition"
                >
                  Add Requirement
                </button>

              </div>

            ) : (

              <div className="overflow-x-auto">

                <table className="w-full">

                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50/70 dark:bg-gray-700/50">

                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Requirement
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Framework
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Owner
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Due Date
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>


                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700">

                    {paginatedComplianceItems.map((item) => (

                      <tr
                        key={item.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
                      >

                        {/* Requirement */}

                        <td className="px-6 py-5">

                          <p className="font-semibold text-gray-900 dark:text-white">
                            {item.requirementName}
                          </p>

                          <p className="text-xs text-gray-400 dark:text-gray-400 mt-1">
                            Compliance requirement
                          </p>

                        </td>
                          

                        {/* Framework */}

                        <td className="px-6 py-5">

                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {item.framework || "—"}
                          </span>

                        </td>


                        {/* Owner */}

                        <td className="px-6 py-5">

                          <span className="text-sm text-gray-600 dark:text-gray-300">
                            {item.owner || "—"}
                          </span>

                        </td>


                        {/* Due Date */}

                        <td className="px-6 py-5">

                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {item.dueDate || "—"}
                          </span>

                        </td>


                       {/* Status */}

                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${
                            item.status === "Compliant"
                              ? "bg-green-50 dark:bg-green-950/50 text-green-700 dark:text-green-300"
                              : item.status === "Due Soon"
                              ? "bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300"
                              : item.status === "Non-Compliant"
                              ? "bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-300"
                              : "bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300"
                          }`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-current" />

                          {item.status || "Unknown"}
                        </span>
                      </td>


                        {/* Action */}

                        <td className="px-6 py-5 text-right">
                        <div className="flex items-center justify-end gap-2">

                          <button
                            type="button"
                          onClick={() => {
                            setSelectedComplianceView(item);
                          }}
                            className="px-3 py-2 text-sm font-semibold text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-900/40 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/60 transition"
                          >
                            View
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setSelectedCompliance(item);
                              setShowComplianceModal(true);
                            }}
                            className="px-3 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setDeleteConfirm({
                                type: "compliance",
                                id: item.id,
                                name: item.requirementName,
                              });
                            }}
                            className="px-3 py-2 text-sm font-semibold text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-900/40 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/60 transition"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                      </tr>

                    ))}

                  </tbody>

                </table>

              </div>

                  )}

        {/* Pagination */}

        {filteredComplianceItems.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-700/50">

            <p className="text-sm text-gray-500 dark:text-gray-400">
              Showing{" "}
              <span className="font-semibold text-gray-700 dark:text-gray-200">
                {(compliancePage - 1) * complianceRowsPerPage + 1}
              </span>
              {" – "}
              <span className="font-semibold text-gray-700 dark:text-gray-200">
                {Math.min(
                  compliancePage * complianceRowsPerPage,
                  filteredComplianceItems.length
                )}
              </span>
              {" of "}
              <span className="font-semibold text-gray-700 dark:text-gray-200">
                {filteredComplianceItems.length}
              </span>
            </p>

            <div className="flex items-center gap-1">

              <button
                type="button"
                disabled={compliancePage === 1}
                onClick={() =>
                  setCompliancePage((page) => Math.max(1, page - 1))
                }
                className="w-9 h-9 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                ←
              </button>

             {Array.from(
  { length: complianceTotalPages },
  (_, index) => index + 1
)
  .filter(
    (page) =>
      page === 1 ||
      page === complianceTotalPages ||
      Math.abs(page - compliancePage) <= 1
  )
  .map((page, index, pages) => (
    <span key={page} className="flex items-center gap-1">

      {index > 0 && pages[index - 1] !== page - 1 && (
        <span className="px-1 text-gray-400">
          ...
        </span>
      )}

      <button
        type="button"
        onClick={() => setCompliancePage(page)}
        className={`w-9 h-9 rounded-lg text-sm font-semibold transition ${
          compliancePage === page
            ? "bg-green-600 text-white"
            : "border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
        }`}
      >
        {page}
      </button>

    </span>
  ))}

              <button
                type="button"
                disabled={compliancePage === complianceTotalPages}
                onClick={() =>
                  setCompliancePage((page) =>
                    Math.min(complianceTotalPages, page + 1)
                  )
                }
                className="w-9 h-9 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                →
              </button>

            </div>

          </div>
        )}

      </div>
      
        </section> 

        
{/* Audit Management */}

<section className="mt-8">

  <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-5">

    <div>
      <p className="text-sm font-semibold text-green-600 dark:text-green-400 uppercase tracking-wider">
        Audit & Assurance
      </p>

      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
        Audit Management
      </h2>

      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
        Monitor governance audits, ownership, timelines and progress.
      </p>
    </div>

    <button
      type="button"
      onClick={() => setShowAuditModal(true)}
      className="px-5 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition"
    >
      + Start Audit
    </button>

  </div>


          {/* Audit Controls */}

          <div className={`border rounded-2xl shadow-sm p-4 mb-4 ${darkMode ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-200 text-gray-900"}`}>

            <div className="flex flex-col xl:flex-row gap-3">

              {/* Search */}

              <div className="relative flex-1">

                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  ⌕
                </span>

                <input
                  type="text"
                  value={auditSearch}
                  onChange={(e) => {
                    setAuditSearch(e.target.value);
                    setAuditPage(1);
                  }}
                  placeholder="Search audits or owners..."
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-700 dark:text-white outline-none focus:bg-white dark:focus:bg-gray-900 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                />

              </div>


              {/* Status Filter */}

              <select
                value={auditStatusFilter}
                onChange={(e) => {
                  setAuditStatusFilter(e.target.value);
                  setAuditPage(1);
                }}
                className="xl:w-48 px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium text-gray-700 dark:text-white outline-none focus:bg-white dark:focus:bg-gray-900 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
              >

                <option value="All">
                  All Statuses
                </option>

                <option value="Planned">
                  Planned
                </option>

                <option value="In Progress">
                  In Progress
                </option>

                <option value="Completed">
                  Completed
                </option>

                <option value="On Hold">
                  On Hold
                </option>

              </select>


              {/* Audit Type Filter */}

              <select
                value={auditTypeFilter}
                onChange={(e) => {
                  setAuditTypeFilter(e.target.value);
                  setAuditPage(1);
                }}
                className="xl:w-48 px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium text-gray-700 dark:text-white outline-none focus:bg-white dark:focus:bg-gray-900 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
              >

                <option value="All">
                  All Audit Types
                </option>

                <option value="Internal">
                  Internal
                </option>

                <option value="External">
                  External
                </option>

                <option value="Compliance">
                  Compliance
                </option>

                <option value="ESG">
                  ESG
                </option>

                <option value="Governance">
                  Governance
                </option>

              </select>


              {/* Reset */}

              {(auditSearch ||
                auditStatusFilter !== "All" ||
                auditTypeFilter !== "All") && (

                <button
                  type="button"
                  onClick={() => {
                    setAuditSearch("");
                    setAuditStatusFilter("All");
                    setAuditTypeFilter("All");
                    setAuditPage(1);
                  }}
                  className="px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                >
                  Reset
                </button>

              )}

            </div>

          </div>

          
  {/* Audit Table */}

  <div className={`border rounded-2xl shadow-sm overflow-hidden ${darkMode ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-200 text-gray-900"}`}>

    {audits.length === 0 ? (

      <div className="p-12 text-center">

        <div className="w-14 h-14 mx-auto rounded-2xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-400 dark:text-gray-300 text-2xl">
          ◉
        </div>

        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-4">
          No audits yet
        </h3>

        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Start your first audit to begin tracking assurance activities.
        </p>

        <button
          type="button"
          onClick={() => setShowAuditModal(true)}
          className="mt-5 px-5 py-2.5 bg-green-600 text-white rounded-xl text-sm font-semibold hover:bg-green-700 transition"
        >
          Start Audit
        </button>

      </div>

    ) : (

      <div className="overflow-x-auto">

       <table className="w-full">

  <thead>
    <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50/70 dark:bg-gray-700/50">

      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
        Audit
      </th>

      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
        Type
      </th>

      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
        Owner
      </th>

      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
        Timeline
      </th>

      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
        Status
      </th>

      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
        Action
      </th>

    </tr>
  </thead>

  <tbody className="divide-y divide-gray-100 dark:divide-gray-700">

    {paginatedAudits.map((audit) => (

      <tr
        key={audit.id}
        className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
      >

        {/* Audit */}

       <td className="px-6 py-4">

  <div className="flex items-center gap-3">

    <div className="w-9 h-9 rounded-xl bg-green-50 dark:bg-green-900/60 text-green-700 dark:text-green-300 flex items-center justify-center text-sm font-bold">
      A
    </div>

    <div className="min-w-0">

      <p className="font-semibold text-gray-900 dark:text-white truncate">
        {audit.auditName}
      </p>

      <p className="text-xs text-gray-400 dark:text-gray-400 mt-0.5">
        Governance audit
      </p>

    </div>

  </div>

</td>

        {/* Type */}

        <td className="px-6 py-5">

          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {audit.auditType || "—"}
          </span>

        </td>


        {/* Owner */}

        <td className="px-6 py-5">

          <span className="text-sm text-gray-600 dark:text-gray-300">
            {audit.auditOwner || "—"}
          </span>

        </td>


        {/* Timeline */}

        <td className="px-6 py-5">

          <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {audit.startDate || "—"}
          </div>

          <div className="text-xs text-gray-400 dark:text-gray-400 mt-1">
            Target: {audit.targetDate || "—"}
          </div>

        </td>


        {/* Status */}

        <td className="px-6 py-5">

          <span
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${
              audit.status === "Completed"
                ? "bg-green-50 dark:bg-green-950/50 text-green-700 dark:text-green-300"
                : audit.status === "In Progress"
                ? "bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300"
                : audit.status === "On Hold"
                ? "bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-300"
                : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
            }`}
          >

            <span className="w-1.5 h-1.5 rounded-full bg-current" />

            {audit.status || "Planned"}

          </span>

        </td>


        {/* Action */}

        <td className="px-6 py-5">

          <div className="flex items-center justify-end gap-2">

          <button
            type="button"
            onClick={() => {
              setSelectedAuditView(audit);
            }}
            className="px-3 py-2 text-sm font-semibold text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-900/40 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/60 transition"
          >
            View
          </button>

            <button
              type="button"
              onClick={() => {
                setSelectedAudit(audit);
                setShowAuditModal(true);
              }}
              className="px-3 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition"
            >
              Edit
            </button>

           <button
              type="button"
              onClick={() => {
                setDeleteConfirm({
                  type: "audit",
                  id: audit.id,
                  name: audit.auditName,
                });
              }}
              className="px-3 py-2 text-sm font-semibold text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-900/40 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/60 transition"
            >
              Delete
            </button>

          </div>

        </td>

      </tr>

    ))}

  </tbody>

</table>

             {/* Audit Pagination */}

        {filteredAudits.length > 0 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-700/50">

            <p className="text-sm text-gray-500 dark:text-gray-400">
              Showing{" "}
              <span className="font-semibold text-gray-700 dark:text-gray-200">
                {(auditPage - 1) * auditRowsPerPage + 1}
              </span>
              {" – "}
              <span className="font-semibold text-gray-700 dark:text-gray-200">
                {Math.min(
                  auditPage * auditRowsPerPage,
                  filteredAudits.length
                )}
              </span>
              {" of "}
              <span className="font-semibold text-gray-700 dark:text-gray-200">
                {filteredAudits.length}
              </span>
            </p>

            <div className="flex items-center gap-1">

              <button
                type="button"
                disabled={auditPage === 1}
                onClick={() =>
                  setAuditPage((page) => Math.max(1, page - 1))
                }
                className="w-9 h-9 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                ←
              </button>

              {Array.from(
                { length: auditTotalPages },
                (_, index) => index + 1
              )
                .filter(
                  (page) =>
                    page === 1 ||
                    page === auditTotalPages ||
                    Math.abs(page - auditPage) <= 1
                )
                .map((page, index, pages) => (
                  <span
                    key={page}
                    className="flex items-center gap-1"
                  >

                    {index > 0 &&
                      pages[index - 1] !== page - 1 && (
                        <span className="px-1 text-gray-400">
                          ...
                        </span>
                      )}

                    <button
                      type="button"
                      onClick={() => setAuditPage(page)}
                      className={`w-9 h-9 rounded-lg text-sm font-semibold transition ${
                        auditPage === page
                          ? "bg-green-600 text-white"
                          : "border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                    >
                      {page}
                    </button>

                  </span>
                ))}

              <button
                type="button"
                disabled={auditPage === auditTotalPages}
                onClick={() =>
                  setAuditPage((page) =>
                    Math.min(auditTotalPages, page + 1)
                  )
                }
                className="w-9 h-9 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                →
              </button>

            </div>

          </div>
        )}

      </div>

    )}
  </div>
</section>

        {/* Active Policies & Risk Register Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          {/* Active Policies */}
          <div className={`border rounded-2xl p-7 shadow-sm ${darkMode ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-200 text-gray-900"}`}>
            <div className="flex items-center justify-between mb-5">
              <div>
                <span className="text-xs font-bold text-green-600 dark:text-green-400 uppercase tracking-wider">
                  Policy Framework
                </span>
                <h3 className={`text-2xl font-bold mt-1 ${darkMode ? "text-white" : "text-gray-900"}`}>
                  Active Policies ({policies.length})
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowPolicyModal(true)}
                className="px-3.5 py-2 bg-green-50 dark:bg-green-900/40 hover:bg-green-100 dark:hover:bg-green-900/60 text-green-700 dark:text-green-300 text-xs font-bold rounded-xl transition flex items-center gap-1"
              >
                <span>+</span> Add Policy
              </button>
            </div>

            {policies.length === 0 ? (
              <div className="rounded-xl border border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 p-6 text-center">
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">No active policies yet</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Click "+ Add Policy" to create your first governance policy.</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
                {policies.map((p) => (
                  <div key={p.id} className="p-4 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-700 rounded-xl flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white text-sm">{p.policyName || "Untitled Policy"}</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        Category: <span className="font-medium text-gray-700 dark:text-gray-300">{p.policyCategory || "General"}</span> | Owner: <span className="font-medium text-gray-700 dark:text-gray-300">{p.policyOwner || "Unassigned"}</span>
                      </p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${p.status === "Active" ? "bg-green-100 dark:bg-green-950/60 text-green-800 dark:text-green-300" : "bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300"}`}>
                      {p.status || "Active"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Risk Register */}
          <div className={`border rounded-2xl p-7 shadow-sm ${darkMode ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-200 text-gray-900"}`}>
            <div className="flex items-center justify-between mb-5">
              <div>
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                  Risk Management
                </span>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  Risk Register ({risks.length})
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowRiskModal(true)}
                className="px-3.5 py-2 bg-amber-50 dark:bg-amber-900/40 hover:bg-amber-100 dark:hover:bg-amber-900/60 text-amber-700 dark:text-amber-300 text-xs font-bold rounded-xl transition flex items-center gap-1"
              >
                <span>+</span> Add Risk
              </button>
            </div>

            {risks.length === 0 ? (
              <div className="rounded-xl border border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 p-6 text-center">
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">No open risks registered</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Click "+ Add Risk" to log an organizational risk factor.</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
                {risks.map((r) => (
                  <div key={r.id} className="p-4 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-700 rounded-xl flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white text-sm">{r.riskTitle || r.title || "Risk Factor"}</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        Owner: <span className="font-medium text-gray-700 dark:text-gray-300">{r.riskOwner || "Risk Team"}</span> | Category: <span className="font-medium text-gray-700 dark:text-gray-300">{r.riskCategory || "Operational"}</span>
                      </p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${r.severity === "High" || r.severity === "Critical" ? "bg-red-100 dark:bg-red-950/60 text-red-800 dark:text-red-300" : "bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300"}`}>
                      {r.severity || "Medium"} Severity
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

      </main>

      {/* Governance Policy Modal */}
      {showPolicyModal && (
        <GovernancePolicyModal
          onClose={() => setShowPolicyModal(false)}
          onSave={async (policyData) => {
            try {
              await addDoc(collection(db, "governancePolicies"), {
                ...policyData,
                createdAt: new Date().toISOString(),
              });
              setShowPolicyModal(false);
              setToastNotice({
                type: "success",
                message: "Governance policy added successfully!",
              });
              setTimeout(() => setToastNotice(null), 3000);
            } catch (err) {
              console.error("Error adding policy:", err);
              setToastNotice({
                type: "error",
                message: "Failed to add policy. Please try again.",
              });
              setTimeout(() => setToastNotice(null), 3000);
            }
          }}
        />
      )}

      {/* Governance Risk Modal */}
      {showRiskModal && (
        <GovernanceRiskModal
          onClose={() => setShowRiskModal(false)}
          onSave={async (riskData) => {
            try {
              await addDoc(collection(db, "governanceRisks"), {
                ...riskData,
                createdAt: new Date().toISOString(),
              });
              setShowRiskModal(false);
              setToastNotice({
                type: "success",
                message: "Governance risk added successfully!",
              });
              setTimeout(() => setToastNotice(null), 3000);
            } catch (err) {
              console.error("Error adding risk:", err);
              setToastNotice({
                type: "error",
                message: "Failed to add risk. Please try again.",
              });
              setTimeout(() => setToastNotice(null), 3000);
            }
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
          onClick={() => setDeleteConfirm(null)}
        >
          <div
            className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 pt-6 pb-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-red-50 dark:bg-red-900/50 text-red-600 dark:text-red-300 flex items-center justify-center">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 9v2m0 4h.01M5.07 19h13.86c1.54 0 2.5-1.67 1.73-3L13.73 4c-.77-1.33-2.69-1.33-3.46 0L3.34 16c-.77 1.33.19 3 1.73 3z"
                      />
                    </svg>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      Confirm deletion
                    </h3>

                    <p className="text-xs text-gray-400 dark:text-gray-400 mt-0.5">
                      This action cannot be undone
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setDeleteConfirm(null)}
                  className="w-8 h-8 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition flex items-center justify-center"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="px-6 pb-6">
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-6">
                Are you sure you want to delete this{" "}
                <span className="font-semibold text-gray-900 dark:text-white">
                  {deleteConfirm.type === "compliance"
                    ? "compliance requirement"
                    : "audit"}
                </span>
                ?
              </p>

              <div className="mt-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-700 px-4 py-3">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  {deleteConfirm.type === "compliance"
                    ? "Requirement"
                    : "Audit"}
                </p>

                <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1 truncate">
                  {deleteConfirm.name}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setDeleteConfirm(null)}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={async () => {
                    try {
                      if (deleteConfirm.type === "compliance") {
                        await deleteDoc(
                          doc(
                            db,
                            "governanceCompliance",
                            deleteConfirm.id
                          )
                        );
                      } else {
                        await deleteDoc(
                          doc(
                            db,
                            "governanceAudits",
                            deleteConfirm.id
                          )
                        );
                      }

                      setDeleteConfirm(null);

                      setToastNotice({
                        type: "success",
                        message:
                          deleteConfirm.type === "compliance"
                            ? "Compliance requirement deleted"
                            : "Audit deleted",
                      });

                      setTimeout(() => {
                        setToastNotice(null);
                      }, 3000);
                    } catch (error) {
                      console.error("Error deleting item:", error);

                      setDeleteConfirm(null);

                      setToastNotice({
                        type: "error",
                        message: "Unable to delete. Please try again.",
                      });

                      setTimeout(() => {
                        setToastNotice(null);
                      }, 3000);
                    }
                  }}
                  className="px-4 py-2.5 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition shadow-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastNotice && (
        <div className="fixed bottom-6 right-6 z-[70]">
          <div
            className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl border ${
              toastNotice.type === "success"
                ? "bg-white dark:bg-gray-800 border-green-200 dark:border-green-800"
                : "bg-white dark:bg-gray-800 border-red-200 dark:border-red-800"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                toastNotice.type === "success"
                  ? "bg-green-50 dark:bg-green-950/60 text-green-600 dark:text-green-300"
                  : "bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-300"
              }`}
            >
              {toastNotice.type === "success" ? "✓" : "!"}
            </div>

            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {toastNotice.type === "success" ? "Deleted successfully" : "Action failed"}
              </p>

              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {toastNotice.message}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Governance;