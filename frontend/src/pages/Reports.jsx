import { useEffect, useState } from "react";

import Sidebar from "../components/Sidebar";
import { useTheme } from "../context/ThemeContext";

import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
} from "firebase/firestore";

import { db } from "../config/firebase";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

function Reports() {
  const { darkMode } = useTheme();

  const [latestSocialRecord, setLatestSocialRecord] = useState(null);
  const [socialLoading, setSocialLoading] = useState(true);
  const [latestEnvironmentalRecord, setLatestEnvironmentalRecord] = useState(null);
  const [environmentalLoading, setEnvironmentalLoading] = useState(true);
  const [governanceAudits, setGovernanceAudits] = useState([]);
  const [governanceCompliance, setGovernanceCompliance] = useState([]);
  const [governancePolicies, setGovernancePolicies] = useState([]);
  const [governanceRisks, setGovernanceRisks] = useState([]);
  const [governanceLoading, setGovernanceLoading] = useState(true);
  const [selectedFramework, setSelectedFramework] = useState("BRSR (SEBI Standard)");

  useEffect(() => {
    const fetchGovernanceData = async () => {
      try {
        const auditSnap = await getDocs(collection(db, "governanceAudits"));
        setGovernanceAudits(auditSnap.docs.map((doc) => doc.data()));

        const complianceSnap = await getDocs(collection(db, "governanceCompliance"));
        setGovernanceCompliance(complianceSnap.docs.map((doc) => doc.data()));

        const policySnap = await getDocs(collection(db, "governancePolicies"));
        setGovernancePolicies(policySnap.docs.map((doc) => doc.data()));

        const riskSnap = await getDocs(collection(db, "governanceRisks"));
        setGovernanceRisks(riskSnap.docs.map((doc) => doc.data()));
      } catch (error) {
        console.error("Error fetching governance data for report:", error);
      } finally {
        setGovernanceLoading(false);
      }
    };
    fetchGovernanceData();
  }, []);

 // PDF FUNCTION
 const handleExportPDF = () => {

  const doc = new jsPDF();


  // ==============================
  // TITLE
  // ==============================

  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");

  doc.text(
    `GreenOps AI - ESG Report [${selectedFramework}]`,
    20,
    20
  );

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");

  doc.text(
    `Generated on: ${new Date().toLocaleDateString()} | Framework: ${selectedFramework}`,
    20,
    28
  );


  // ==============================
  // ESG PERFORMANCE
  // ==============================

  doc.setFontSize(15);
  doc.setFont("helvetica", "bold");

  doc.text(
    "ESG Performance Overview",
    20,
    42
  );


  autoTable(doc, {

    startY: 48,

    head: [
      [
        "Performance Metric",
        "Score"
      ]
    ],

    body: [
      [
        "Overall ESG Score",
        `${overallESGScore}/100`
      ],
      [
        "Environmental Score",
        `${environmentalScore}/100`
      ],
      [
        "Social Score",
        `${socialScore}/100`
      ],
      [
        "Governance Score",
        `${governanceScore}/100`
      ]
    ],

    theme: "grid",

    headStyles: {
      fillColor: [22, 163, 74]
    }

  });


  // ==============================
  // ENVIRONMENTAL DATA
  // ==============================

  const environmentalStartY =
    doc.lastAutoTable.finalY + 15;


  doc.setFontSize(15);
  doc.setFont("helvetica", "bold");

  doc.text(
    "Latest Environmental Data",
    20,
    environmentalStartY
  );


  if (latestEnvironmentalRecord) {

    autoTable(doc, {

      startY: environmentalStartY + 6,

      head: [
        [
          "Carbon Emissions",
          "Energy Usage",
          "Water Usage"
        ]
      ],

      body: [
        [
          `${latestEnvironmentalRecord.carbon} tCO2`,
          `${latestEnvironmentalRecord.energy} kWh`,
          `${latestEnvironmentalRecord.water} L`
        ]
      ],

      theme: "grid"

    });

  } else {

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");

    doc.text(
      "No environmental data available.",
      20,
      environmentalStartY + 8
    );

  }


  // ==============================
  // SOCIAL DATA
  // ==============================

  const socialStartY =
    doc.lastAutoTable
      ? doc.lastAutoTable.finalY + 15
      : environmentalStartY + 20;


  doc.setFontSize(15);
  doc.setFont("helvetica", "bold");

  doc.text(
    "Latest Social Data",
    20,
    socialStartY
  );


  if (latestSocialRecord) {

    autoTable(doc, {

      startY: socialStartY + 6,

      head: [
        [
          "Employees",
          "Training Hours",
          "Safety Incidents",
          "CSR Activities"
        ]
      ],

      body: [
        [
          latestSocialRecord.totalEmployees,
          latestSocialRecord.trainingHours,
          latestSocialRecord.safetyIncidents,
          latestSocialRecord.csrActivities
        ]
      ],

      theme: "grid"

    });

  } else {

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");

    doc.text(
      "No social data available.",
      20,
      socialStartY + 8
    );

  }

  // ==============================
  // GOVERNANCE DATA
  // ==============================

  const governanceStartY =
    doc.lastAutoTable
      ? doc.lastAutoTable.finalY + 15
      : socialStartY + 20;

  doc.setFontSize(15);
  doc.setFont("helvetica", "bold");
  doc.text("Governance Overview", 20, governanceStartY);

  autoTable(doc, {
    startY: governanceStartY + 6,
    head: [["Governance Metric", "Value"]],
    body: [
      ["Governance Score", `${governanceScore}/100`],
      ["Active Governance Audits", `${governanceAudits.length}`],
      ["Tracked Compliance Requirements", `${governanceCompliance.length}`],
      ["Active Governance Policies", `${governancePolicies.length}`],
      ["Tracked Governance Risks", `${governanceRisks.length}`],
    ],
    theme: "grid",
    headStyles: {
      fillColor: [147, 51, 234],
    },
  });

  // ==============================
  // FOOTER
  // ==============================

  const pageHeight = doc.internal.pageSize.height;

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");

  doc.text(
    "Generated by GreenOps AI ESG Management Platform",
    20,
    pageHeight - 10
  );

  // ==============================
  // SAVE
  // ==============================

  doc.save("GreenOps_AI_ESG_Report.pdf");

};

const handleExportExcel = () => {

  const reportData = [

    {
      "Metric": "Overall ESG Score",
      "Value": overallESGScore,
      "Unit": "/ 100",
    },

    {
      "Metric": "Environmental Score",
      "Value": environmentalScore,
      "Unit": "/ 100",
    },

    {
      "Metric": "Social Score",
      "Value": socialScore,
      "Unit": "/ 100",
    },

    {
      "Metric": "Governance Score",
      "Value": governanceScore,
      "Unit": "/ 100",
    },

    {
      "Metric": "Total Employees",
      "Value": totalEmployeesValue,
      "Unit": "Employees",
    },

    {
      "Metric": "Carbon Emissions",
      "Value": latestEnvironmentalRecord?.carbon || 0,
      "Unit": "tCO2",
    },

    {
      "Metric": "Energy Usage",
      "Value": latestEnvironmentalRecord?.energy || 0,
      "Unit": "kWh",
    },

    {
      "Metric": "Water Consumption",
      "Value": latestEnvironmentalRecord?.water || 0,
      "Unit": "Litres",
    },

    {
      "Metric": "Training Hours",
      "Value": latestSocialRecord?.trainingHours || 0,
      "Unit": "Hours",
    },

    {
      "Metric": "Safety Incidents",
      "Value": latestSocialRecord?.safetyIncidents || 0,
      "Unit": "Incidents",
    },

    {
      "Metric": "CSR Activities",
      "Value": latestSocialRecord?.csrActivities || 0,
      "Unit": "Activities",
    },

    {
      "Metric": "Governance Audits",
      "Value": governanceAudits.length,
      "Unit": "Audits",
    },

    {
      "Metric": "Compliance Requirements",
      "Value": governanceCompliance.length,
      "Unit": "Items",
    },

    {
      "Metric": "Governance Policies",
      "Value": governancePolicies.length,
      "Unit": "Policies",
    },

    {
      "Metric": "Governance Risks",
      "Value": governanceRisks.length,
      "Unit": "Risks",
    },

  ];


  const worksheet = XLSX.utils.json_to_sheet(reportData);

  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "ESG Report"
  );


  XLSX.writeFile(
    workbook,
    "GreenOps_AI_ESG_Report.xlsx"
  );

};




  useEffect(() => {

    const fetchLatestSocialRecord = async () => {

      try {

        const q = query(
          collection(db, "socialData"),
          orderBy("createdAt", "desc"),
          limit(1)
        );

        const snapshot = await getDocs(q);


        if (!snapshot.empty) {

          setLatestSocialRecord({
            id: snapshot.docs[0].id,
            ...snapshot.docs[0].data(),
          });

        } else {

          setLatestSocialRecord(null);

        }

      } catch (error) {

        console.error(
          "Error fetching social record:",
          error
        );

      } finally {

        setSocialLoading(false);

      }

    };


    fetchLatestSocialRecord();

  }, []);


useEffect(() => {

  const fetchLatestEnvironmentalRecord = async () => {

    try {

      const q = query(
        collection(db, "environmentalData"),
        orderBy("createdAt", "desc"),
        limit(1)
      );

      const snapshot = await getDocs(q);

      if (!snapshot.empty) {

        setLatestEnvironmentalRecord(
          snapshot.docs[0].data()
        );

      } else {

        setLatestEnvironmentalRecord(null);

      }

    } catch (error) {

      console.error(
        "Error fetching environmental record:",
        error
      );

    } finally {

      setEnvironmentalLoading(false);

    }

  };

  fetchLatestEnvironmentalRecord();

}, []);

  // ==============================
  // SOCIAL DATA
  // ==============================

  const totalEmployeesValue =
    latestSocialRecord?.totalEmployees || 0;


  const trainingHoursValue =
    latestSocialRecord?.trainingHours || 0;


  const safetyIncidentsValue =
    latestSocialRecord?.safetyIncidents || 0;


  const csrActivitiesValue =
    latestSocialRecord?.csrActivities || 0;


  const employeesTrainedValue =
    latestSocialRecord?.employeesTrained || 0;


  // ==============================
  // WORKFORCE PERCENTAGES
  // ==============================

  const malePercentage =
    latestSocialRecord?.totalEmployees
      ? Math.round(
          (latestSocialRecord.maleEmployees /
            latestSocialRecord.totalEmployees) *
            100
        )
      : 0;


  const femalePercentage =
    latestSocialRecord?.totalEmployees
      ? Math.round(
          (latestSocialRecord.femaleEmployees /
            latestSocialRecord.totalEmployees) *
            100
        )
      : 0;


  const otherPercentage =
    latestSocialRecord?.totalEmployees
      ? Math.max(
          0,
          100 - malePercentage - femalePercentage
        )
      : 0;


  // ==============================
  // TRAINING
  // ==============================

  const averageTrainingHours =
    employeesTrainedValue > 0
      ? trainingHoursValue / employeesTrainedValue
      : 0;


  // ==============================
  // SOCIAL SCORE
  // ==============================

  const largestWorkforcePercentage = Math.max(
    malePercentage,
    femalePercentage,
    otherPercentage
  );


  const diversityScore =
    latestSocialRecord?.totalEmployees > 0
      ? Math.max(
          0,
          Math.min(
            25,
            Math.round(
              ((1 -
                largestWorkforcePercentage / 100) /
                (2 / 3)) *
                25
            )
          )
        )
      : 0;


  const trainingScore =
    latestSocialRecord
      ? Math.min(
          25,
          Math.round(
            (averageTrainingHours / 5) * 25
          )
        )
      : 0;


  const safetyScore =
    latestSocialRecord
      ? Math.max(
          0,
          25 - safetyIncidentsValue * 5
        )
      : 0;


  const csrScore =
    latestSocialRecord
      ? Math.min(
          25,
          csrActivitiesValue * 2
        )
      : 0;


  const socialScore =
    diversityScore +
    trainingScore +
    safetyScore +
    csrScore;


// ==============================
// ENVIRONMENTAL SCORE
// ==============================

const environmentalScore = (() => {

  if (!latestEnvironmentalRecord) {
    return 0;
  }

  let score = 100;

  // Carbon Emissions
  if (latestEnvironmentalRecord.carbon > 500) {
    score -= 25;
  } else if (latestEnvironmentalRecord.carbon > 300) {
    score -= 15;
  } else if (latestEnvironmentalRecord.carbon > 100) {
    score -= 5;
  }

  // Energy Usage
  if (latestEnvironmentalRecord.energy > 2000) {
    score -= 25;
  } else if (latestEnvironmentalRecord.energy > 1000) {
    score -= 15;
  } else if (latestEnvironmentalRecord.energy > 500) {
    score -= 5;
  }

  // Water Consumption
  if (latestEnvironmentalRecord.water > 10000) {
    score -= 25;
  } else if (latestEnvironmentalRecord.water > 5000) {
    score -= 15;
  } else if (latestEnvironmentalRecord.water > 3000) {
    score -= 5;
  }

  return Math.max(score, 0);

})();
// ==============================
// GOVERNANCE SCORE & CALCULATIONS
// ==============================

const totalCompliance = governanceCompliance.length;
const compliantCount = governanceCompliance.filter((item) => item.status === "Compliant").length;
const complianceScore = totalCompliance > 0
  ? Math.round((compliantCount / totalCompliance) * 100)
  : 88;

const totalPolicies = governancePolicies.length;
const activePoliciesCount = governancePolicies.filter((p) => p.status === "Active" || !p.status).length;
const policyScore = totalPolicies > 0
  ? Math.round((activePoliciesCount / totalPolicies) * 100)
  : 90;

const totalRisks = governanceRisks.length;
const highRisksCount = governanceRisks.filter((r) => r.severity === "High" || r.severity === "Critical").length;
const riskScore = totalRisks > 0
  ? Math.max(0, Math.round(((totalRisks - highRisksCount) / totalRisks) * 100))
  : 78;

const totalAudits = governanceAudits.length;
const completedAuditsCount = governanceAudits.filter((a) => a.status === "Completed" || a.status === "Compliant").length;
const auditScore = totalAudits > 0
  ? Math.min(100, Math.round(((completedAuditsCount + 1) / (totalAudits + 1)) * 95))
  : 82;

const ethicsScore = Math.round((policyScore * 0.5) + (complianceScore * 0.5));

const governanceScore = Math.round(
  (complianceScore + policyScore + riskScore + auditScore + ethicsScore) / 5
);

// ==============================
// OVERALL ESG SCORE (E + S + G AVERAGE)
// ==============================

const overallESGScore = (() => {
  const scores = [];
  if (latestEnvironmentalRecord) scores.push(environmentalScore);
  if (latestSocialRecord) scores.push(socialScore);
  scores.push(governanceScore);

  if (scores.length === 0) return 0;
  return Math.round(scores.reduce((acc, curr) => acc + curr, 0) / scores.length);
})();

  return (
    <div className={`flex min-h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 ml-0 md:ml-64">

        {/* HEADER */}
        <div className={`fixed top-0 left-0 md:left-64 right-0 border-b z-40 ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>

          <div className="px-4 md:px-10 py-4 md:py-6 flex justify-between items-center">

            <div className="pl-12 md:pl-0">

              <h1 className={`text-4xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
                ESG Reports
              </h1>

              <p className={`mt-2 text-lg ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                Generate sustainability reports, analytics and ESG summaries.
              </p>

            </div>

            {/* Live System */}
            <div className={`hidden md:flex items-center gap-3 px-5 py-2 rounded-full shadow-lg ${
              darkMode
                ? "bg-green-900/30 border border-green-700 text-green-400 shadow-green-900/20"
                : "bg-green-50 border border-green-300 text-green-700 shadow-green-200/60"
            }`}>

              <span className="relative flex h-3 w-3">

                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75">
                </span>

                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-600">
                </span>

              </span>

              <span className="font-semibold">
                Live System
              </span>

            </div>

          </div>

        </div>

        {/* PAGE CONTENT */}
        <div className="p-4 md:p-10 pt-28 md:pt-40 space-y-6 md:space-y-8">

          {/* FRAMEWORK SELECTOR CARD */}
          <div className={`p-6 rounded-2xl shadow-sm border ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
            <h3 className={`text-xs font-bold uppercase tracking-wider mb-3 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
              Select Regulatory Framework Standard for Report Export
            </h3>
            <div className="flex flex-wrap gap-3">
              {[
                { id: "BRSR (SEBI Standard)", label: "🇮🇳 BRSR (SEBI Standard)" },
                { id: "GRI Standards", label: "🌐 GRI (Global Reporting Initiative)" },
                { id: "CSRD (EU Taxonomy)", label: "🇪🇺 CSRD (EU Standards)" },
                { id: "TCFD Framework", label: "🌱 TCFD Climate Disclosures" },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedFramework(item.id)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                    selectedFramework === item.id
                      ? "bg-green-700 text-white shadow-md shadow-green-700/20 scale-105"
                      : darkMode
                      ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* ESG SUMMARY */}

<div>

  <h2 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>
    ESG Performance Overview
  </h2>

  <p className={`mt-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
    Summary of your organization's current sustainability performance.
  </p>

</div>


{/* KPI CARDS */}

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">

  {/* Overall ESG Score */}

  <div className={`rounded-2xl border shadow-sm p-6 ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>

    <p className={`text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
      Overall ESG Score
    </p>

    <p className={`text-3xl font-bold mt-2 ${darkMode ? "text-green-400" : "text-green-700"}`}>
  {overallESGScore}/100
</p>

    <p className={`text-xs mt-1 ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
      Out of 100
    </p>

  </div>


  {/* Environmental Score */}

  <div className={`rounded-2xl border shadow-sm p-6 ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>

    <p className={`text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
      Environmental Score
    </p>

    <p className={`text-3xl font-bold mt-2 ${darkMode ? "text-green-400" : "text-green-600"}`}>
  {environmentalLoading
    ? "..."
    : `${environmentalScore}/100`}
</p>

    <p className={`text-xs mt-1 ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
      Environmental performance
    </p>

  </div>


  {/* Social Score */}

  <div className={`rounded-2xl border shadow-sm p-6 ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>

    <p className={`text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
      Social Score
    </p>

   <p className={`text-3xl font-bold mt-2 ${darkMode ? "text-purple-400" : "text-purple-600"}`}>

  {socialLoading ? "..." : `${socialScore}/100`}

</p>

    <p className={`text-xs mt-1 ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
      Social performance
    </p>

  </div>


  {/* Governance Score */}

  <div className={`rounded-2xl border shadow-sm p-6 ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>

    <p className={`text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
      Governance Score
    </p>

    <p className={`text-3xl font-bold mt-2 ${darkMode ? "text-amber-400" : "text-amber-600"}`}>
      {governanceLoading ? "..." : `${governanceScore}/100`}
    </p>

    <p className={`text-xs mt-1 ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
      Governance maturity
    </p>

  </div>


  {/* Total Employees */}

  <div className={`rounded-2xl border shadow-sm p-6 ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>

    <p className={`text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
      Total Employees
    </p>

    <p className={`text-3xl font-bold mt-2 ${darkMode ? "text-blue-400" : "text-blue-600"}`}>

  {socialLoading ? "..." : totalEmployeesValue}

</p>

    <p className={`text-xs mt-1 ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
      Current workforce
    </p>

  </div>

</div>

{/* ESG PERFORMANCE SUMMARY */}

<div className={`rounded-2xl border shadow-sm p-8 ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>

  <div className="mb-6">

    <h2 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>
      ESG Performance Summary
    </h2>

    <p className={`mt-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
      Key sustainability indicators based on the latest available ESG data.
    </p>

  </div>


  {/* Score Summary */}

  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">

    {/* Overall */}

    <div className={`rounded-xl p-5 ${darkMode ? "bg-green-900/20 text-gray-300" : "bg-green-50 text-gray-500"}`}>

      <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
        Overall ESG Score
      </p>

      <p className={`text-3xl font-bold mt-2 ${darkMode ? "text-green-400" : "text-green-700"}`}>
        {overallESGScore}/100
      </p>

      <p className={`text-xs mt-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
        Combined ESG performance
      </p>

    </div>


    {/* Environmental */}

    <div className={`rounded-xl p-5 ${darkMode ? "bg-emerald-900/20 text-gray-300" : "bg-emerald-50 text-gray-500"}`}>

      <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
        Environmental
      </p>

      <p className={`text-3xl font-bold mt-2 ${darkMode ? "text-emerald-400" : "text-emerald-700"}`}>
        {environmentalScore}/100
      </p>

      <p className={`text-xs mt-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
        Environmental performance
      </p>

    </div>


    {/* Social */}

    <div className={`rounded-xl p-5 ${darkMode ? "bg-purple-900/20 text-gray-300" : "bg-purple-50 text-gray-500"}`}>

      <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
        Social
      </p>

      <p className={`text-3xl font-bold mt-2 ${darkMode ? "text-purple-400" : "text-purple-700"}`}>
        {socialScore}/100
      </p>

      <p className={`text-xs mt-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
        Social performance
      </p>

    </div>


    {/* Governance */}

    <div className={`rounded-xl p-5 ${darkMode ? "bg-amber-900/20 text-gray-300" : "bg-amber-50 text-gray-500"}`}>

      <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
        Governance
      </p>

      <p className={`text-3xl font-bold mt-2 ${darkMode ? "text-amber-400" : "text-amber-700"}`}>
        {governanceScore}/100
      </p>

      <p className={`text-xs mt-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
        Governance maturity
      </p>

    </div>

  </div>


  {/* Latest Data */}

  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">

    {/* Environmental Data */}

    <div className={`border rounded-xl p-5 ${darkMode ? "border-gray-700 bg-gray-900/50" : "border-gray-200 bg-white"}`}>

      <h3 className={`text-lg font-semibold ${darkMode ? "text-white" : "text-gray-800"}`}>
        Latest Environmental Data
      </h3>

      {latestEnvironmentalRecord ? (

        <div className="grid grid-cols-3 gap-4 mt-4">

          <div>
            <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
              Carbon Emissions
            </p>

            <p className={`text-lg font-bold mt-1 ${darkMode ? "text-white" : "text-gray-800"}`}>
              {latestEnvironmentalRecord.carbon}
            </p>

            <p className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
              tCO₂
            </p>
          </div>


          <div>
            <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
              Energy Usage
            </p>

            <p className={`text-lg font-bold mt-1 ${darkMode ? "text-white" : "text-gray-800"}`}>
              {latestEnvironmentalRecord.energy}
            </p>

            <p className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
              kWh
            </p>
          </div>


          <div>
            <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
              Water Usage
            </p>

            <p className={`text-lg font-bold mt-1 ${darkMode ? "text-white" : "text-gray-800"}`}>
              {latestEnvironmentalRecord.water}
            </p>

            <p className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
              Litres
            </p>
          </div>

        </div>

      ) : (

        <p className={`text-sm mt-4 ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
          No environmental data available.
        </p>

      )}

    </div>


    {/* Social Data */}

    <div className={`border rounded-xl p-5 ${darkMode ? "border-gray-700 bg-gray-900/50" : "border-gray-200 bg-white"}`}>

      <h3 className={`text-lg font-semibold ${darkMode ? "text-white" : "text-gray-800"}`}>
        Latest Social Data
      </h3>

      {latestSocialRecord ? (

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">

          <div>
            <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
              Employees
            </p>

            <p className={`text-lg font-bold mt-1 ${darkMode ? "text-white" : "text-gray-800"}`}>
              {latestSocialRecord.totalEmployees}
            </p>
          </div>


          <div>
            <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
              Training Hours
            </p>

            <p className={`text-lg font-bold mt-1 ${darkMode ? "text-white" : "text-gray-800"}`}>
              {latestSocialRecord.trainingHours}
            </p>
          </div>


          <div>
            <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
              Safety Incidents
            </p>

            <p className={`text-lg font-bold mt-1 ${darkMode ? "text-white" : "text-gray-800"}`}>
              {latestSocialRecord.safetyIncidents}
            </p>
          </div>


          <div>
            <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
              CSR Activities
            </p>

            <p className={`text-lg font-bold mt-1 ${darkMode ? "text-white" : "text-gray-800"}`}>
              {latestSocialRecord.csrActivities}
            </p>
          </div>

        </div>

      ) : (

        <p className={`text-sm mt-4 ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
          No social data available.
        </p>

      )}

    </div>

  </div>

</div>

{/* REPORT GENERATION */}

<div className={`rounded-2xl border shadow-sm p-8 ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>

  <div className="flex items-center justify-between">

    <div>

      <h2 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>
        Generate ESG Report
      </h2>

      <p className={`mt-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
        Create a sustainability report using the latest ESG data.
      </p>

    </div>

    <div className={`hidden md:flex items-center justify-center w-12 h-12 rounded-xl ${darkMode ? "bg-green-900/30" : "bg-green-50"}`}>
      <span className="text-2xl">
        📄
      </span>
    </div>

  </div>


  {/* Report Options */}

  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">

    {/* PDF Report */}

    <div className={`border rounded-xl p-6 ${darkMode ? "border-gray-700 bg-gray-900/50" : "border-gray-200 bg-white"}`}>

      <h3 className={`text-lg font-semibold ${darkMode ? "text-white" : "text-gray-800"}`}>
        ESG PDF Report
      </h3>

      <p className={`text-sm mt-2 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
        Generate a detailed PDF report containing ESG performance,
        sustainability metrics and key insights.
      </p>

     <button
  onClick={handleExportPDF}
  className="mt-5 px-5 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition"
>
  Generate PDF Report
</button>

    </div>


    {/* Excel Report */}

    <div className={`border rounded-xl p-6 ${darkMode ? "border-gray-700 bg-gray-900/50" : "border-gray-200 bg-white"}`}>

      <h3 className={`text-lg font-semibold ${darkMode ? "text-white" : "text-gray-800"}`}>
        ESG Excel Report
      </h3>

      <p className={`text-sm mt-2 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
        Export ESG records and performance data into an Excel
        spreadsheet for further analysis.
      </p>

      <button
  onClick={handleExportExcel}
  className="mt-5 px-5 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
>
  Export Excel Report
</button>

    </div>

  </div>

</div>

{/* Latest ESG Data */}

<div className={`rounded-2xl border shadow-sm p-8 ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>

  <div className="flex items-center justify-between">

    <div>
      <h2 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>
        Latest ESG Data
      </h2>

      <p className={`mt-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
        Current availability of sustainability data across ESG categories.
      </p>
    </div>

    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${darkMode ? "bg-green-900/30" : "bg-green-50"}`}>
      <span className="text-2xl">
        📊
      </span>
    </div>

  </div>


  {/* Data Status */}

  <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-8">

    {/* Environmental */}

    <div className={`border rounded-xl p-5 ${darkMode ? "border-gray-700 bg-gray-900/50" : "border-gray-200 bg-white"}`}>

      <div className="flex items-center justify-between">

        <h3 className={`font-semibold ${darkMode ? "text-white" : "text-gray-800"}`}>
          Environmental
        </h3>

       <span
  className={`w-3 h-3 rounded-full ${
    latestEnvironmentalRecord
      ? "bg-green-500"
      : "bg-gray-400"
  }`}
></span>

      </div>
<p
  className={`text-sm font-medium mt-3 ${
    latestEnvironmentalRecord
      ? "text-green-600 dark:text-green-400"
      : "text-gray-500 dark:text-gray-400"
  }`}
>
  {latestEnvironmentalRecord
    ? "Data Available"
    : "No Data Available"}
</p>

<p className={`text-xs mt-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
  {latestEnvironmentalRecord
    ? "Latest environmental sustainability record is available."
    : "No environmental records have been submitted yet."}
</p>
    </div>


    {/* Social */}

    <div className={`border rounded-xl p-5 ${darkMode ? "border-gray-700 bg-gray-900/50" : "border-gray-200 bg-white"}`}>

      <div className="flex items-center justify-between">

        <h3 className={`font-semibold ${darkMode ? "text-white" : "text-gray-800"}`}>
          Social
        </h3>

       <span
  className={`w-3 h-3 rounded-full ${
    latestSocialRecord
      ? "bg-green-500"
      : "bg-gray-400"
  }`}
></span>

      </div>

   <p
  className={`text-sm font-medium mt-3 ${
    latestSocialRecord
      ? "text-green-600 dark:text-green-400"
      : "text-gray-500 dark:text-gray-400"
  }`}
>
  {latestSocialRecord
    ? "Data Available"
    : "No Data Available"}
</p>

<p className={`text-xs mt-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
  {latestSocialRecord
    ? "Latest social sustainability record is available."
    : "No social records have been submitted yet."}
</p>

    </div>


    {/* Governance */}

    <div className={`border rounded-xl p-5 ${darkMode ? "border-gray-700 bg-gray-900/50" : "border-gray-200 bg-white"}`}>

      <div className="flex items-center justify-between">

        <h3 className={`font-semibold ${darkMode ? "text-white" : "text-gray-800"}`}>
          Governance
        </h3>

        <span className={`w-3 h-3 rounded-full ${governanceLoading ? "bg-gray-400" : "bg-green-500"}`}></span>

      </div>

      <p className={`text-sm font-medium mt-3 ${governanceLoading ? "text-gray-500 dark:text-gray-400" : "text-green-600 dark:text-green-400"}`}>
        {governanceLoading ? "Loading..." : "Data Available"}
      </p>

      <p className={`text-xs mt-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
        {governanceLoading
          ? "Fetching governance records..."
          : `Active tracking of ${governanceAudits.length} audits, ${governanceCompliance.length} compliance items, and ${governancePolicies.length} policies.`}
      </p>

    </div>

  </div>

</div>


        </div>

      </div>

    </div>
  );
}

export default Reports;