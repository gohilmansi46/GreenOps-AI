import Sidebar from "../components/Sidebar";
import GovernancePolicyModal from "../components/GovernancePolicyModal";
import GovernanceRiskModal from "../components/GovernanceRiskModal";
import GovernanceAuditModal from "../components/GovernanceAuditModal";
import GovernanceComplianceModal from "../components/GovernanceComplianceModal";
import { useEffect, useState } from "react";
import { db } from "../config/firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";

function Governance() {
  const [showPolicyModal, setShowPolicyModal] = useState(false);
  const [showRiskModal, setShowRiskModal] = useState(false);
  const [showAuditModal, setShowAuditModal] = useState(false);
  const [selectedAudit, setSelectedAudit] = useState(null);
  const [showComplianceModal, setShowComplianceModal] = useState(false);
  
  const [selectedCompliance, setSelectedCompliance] = useState(null);

  const [audits, setAudits] = useState([]);
  const [complianceItems, setComplianceItems] = useState([]);

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

  return () => {
    unsubscribeAudits();
    unsubscribeCompliance();
  };
  }, []);


return (
    <div className="flex min-h-screen bg-[#f5f7f8]">
      <Sidebar />

      <main className="flex-1 ml-64 p-8">
        {/* Page Header */}
        <div className="mb-8">
          <p className="text-sm font-semibold text-green-600 uppercase tracking-wider">
            Governance
          </p>

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mt-1">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Governance Overview
              </h1>

              <p className="text-gray-500 mt-2">
                Enterprise governance, risk and compliance oversight.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500">
                Last updated: Today
              </span>

              <button
                type="button"
                className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
              >
                Export Report
              </button>
            </div>
          </div>
        </div>

        {/* Governance Health */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Governance Health
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                High-level view of your governance posture.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

            {/* Governance Score */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <p className="text-sm font-medium text-gray-500">
                Governance Score
              </p>

              <div className="flex items-end justify-between mt-4">
                <p className="text-4xl font-bold text-gray-900">
                  86%
                </p>

                <span className="px-2.5 py-1 rounded-full bg-green-50 text-green-700 text-xs font-semibold">
                  Healthy
                </span>
              </div>

              <p className="text-xs text-gray-400 mt-3">
                Overall governance maturity
              </p>
            </div>

            {/* Policies */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <p className="text-sm font-medium text-gray-500">
                Policies
              </p>

              <p className="text-4xl font-bold text-gray-900 mt-4">
                0
              </p>

              <p className="text-xs text-gray-400 mt-3">
                Active governance policies
              </p>
            </div>

            {/* Risks */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <p className="text-sm font-medium text-gray-500">
                Open Risks
              </p>

              <p className="text-4xl font-bold text-gray-900 mt-4">
                0
              </p>

              <p className="text-xs text-gray-400 mt-3">
                Risks requiring attention
              </p>
            </div>

            {/* Compliance */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <p className="text-sm font-medium text-gray-500">
                Compliance
              </p>

              <p className="text-4xl font-bold text-gray-900 mt-4">
                {complianceItems.length > 0
                ? `${Math.round(
                    (complianceItems.filter(
                      (item) => item.status === "Compliant"
                    ).length /
                      complianceItems.length) *
                      100
                  )}%`
                : "0%"}
              </p>

              <p className="text-xs text-gray-400 mt-3">
                  {complianceItems.length} tracked requirements
              </p>
            </div>

          </div>
        </section>

        {/* Main Dashboard Area */}
        <section className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-6">

          {/* Radar Chart Placeholder */}
          <div className="xl:col-span-2 bg-white border border-gray-200 rounded-2xl p-7 shadow-sm">

            <div>
              <p className="text-sm font-semibold text-green-600 uppercase tracking-wider">
                Governance Performance
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-1">
                Governance Maturity
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Performance across key governance dimensions.
              </p>
            </div>

            <div className="mt-6 h-[380px] flex items-center justify-center">
            <div className="relative w-full max-w-[520px] h-full">

              <svg
                viewBox="0 0 500 380"
                className="w-full h-full"
                role="img"
                aria-label="Governance maturity radar chart"
              >
                {/* Outer radar grid */}
                <polygon
                  points="250,35 390,135 337,300 163,300 110,135"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="1"
                />

                {/* Middle radar grid */}
                <polygon
                  points="250,95 334,155 302,255 198,255 166,155"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="1"
                />

                {/* Inner radar grid */}
                <polygon
                  points="250,155 278,175 267,210 233,210 222,175"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="1"
                />

                {/* Radar axes */}
                <line
                  x1="250"
                  y1="35"
                  x2="250"
                  y2="190"
                  stroke="#e5e7eb"
                  strokeWidth="1"
                />

                <line
                  x1="390"
                  y1="135"
                  x2="250"
                  y2="190"
                  stroke="#e5e7eb"
                  strokeWidth="1"
                />

                <line
                  x1="337"
                  y1="300"
                  x2="250"
                  y2="190"
                  stroke="#e5e7eb"
                  strokeWidth="1"
                />

                <line
                  x1="163"
                  y1="300"
                  x2="250"
                  y2="190"
                  stroke="#e5e7eb"
                  strokeWidth="1"
                />

                <line
                  x1="110"
                  y1="135"
                  x2="250"
                  y2="190"
                  stroke="#e5e7eb"
                  strokeWidth="1"
                />

                {/* Governance performance */}
                <polygon
                  points="250,58 366,145 320,276 185,267 130,143"
                  fill="rgba(16,185,129,0.16)"
                  stroke="#10b981"
                  strokeWidth="2.5"
                />

                {/* Data points */}
                <circle cx="250" cy="58" r="5" fill="#10b981" />
                <circle cx="366" cy="145" r="5" fill="#10b981" />
                <circle cx="320" cy="276" r="5" fill="#10b981" />
                <circle cx="185" cy="267" r="5" fill="#10b981" />
                <circle cx="130" cy="143" r="5" fill="#10b981" />

                {/* Center */}
                <circle
                  cx="250"
                  cy="190"
                  r="7"
                  fill="white"
                  stroke="#10b981"
                  strokeWidth="3"
                />

                {/* Labels */}
                <text
                  x="250"
                  y="20"
                  textAnchor="middle"
                  className="fill-gray-600 text-[13px] font-semibold"
                >
                  Board Governance
                </text>

                <text
                  x="425"
                  y="138"
                  textAnchor="start"
                  className="fill-gray-600 text-[13px] font-semibold"
                >
                  Compliance
                </text>

                <text
                  x="350"
                  y="330"
                  textAnchor="middle"
                  className="fill-gray-600 text-[13px] font-semibold"
                >
                  Risk Management
                </text>

                <text
                  x="150"
                  y="330"
                  textAnchor="middle"
                  className="fill-gray-600 text-[13px] font-semibold"
                >
                  Audit Readiness
                </text>

                <text
                  x="75"
                  y="138"
                  textAnchor="end"
                  className="fill-gray-600 text-[13px] font-semibold"
                >
                  Accountability
                </text>
              </svg>

              {/* Score */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center mt-2">
                  <p className="text-3xl font-bold text-gray-900">
                    86%
                  </p>

                  <p className="text-xs text-gray-500 mt-1">
                    Governance Score
                  </p>
                </div>
              </div>

            </div>
          </div>

          </div>

          {/* Quick Actions */}
          <div className="bg-[#111827] rounded-2xl p-7 shadow-sm text-white">

            <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
              Platform Tools
            </p>

            <h2 className="text-2xl font-bold mt-1">
              Quick Actions
            </h2>

            <p className="text-sm text-gray-400 mt-1">
              Create and manage governance activities.
            </p>

            <div className="grid grid-cols-2 gap-3 mt-7">

              <button
                onClick={() => setShowRiskModal(true)}
                type="button"
                className="min-h-[120px] rounded-2xl border border-gray-600 bg-white/5 hover:bg-white/10 transition p-4 text-left"
              >
                <div className="text-2xl mb-5">
                  ⚠
                </div>

                <p className="text-xs font-bold tracking-wider">
                  ADD RISK
                </p>
              </button>

             <button
                type="button"
                onClick={() => setShowPolicyModal(true)}
                className="min-h-[120px] rounded-2xl border border-gray-600 bg-white/5 hover:bg-white/10 transition p-4 text-left"
              >
                <div className="text-2xl mb-5">
                  ✓
                </div>

                <p className="text-xs font-bold tracking-wider">
                  ADD POLICY
                </p>
              </button>

              <button
                onClick={() => setShowAuditModal(true)}
                type="button"
                className="min-h-[120px] rounded-2xl border border-gray-600 bg-white/5 hover:bg-white/10 transition p-4 text-left"
              >
                <div className="text-2xl mb-5">
                  ◉
                </div>

                <p className="text-xs font-bold tracking-wider">
                  START AUDIT
                </p>
              </button>

              <button
                onClick={() => setShowComplianceModal(true)}
                type="button"
                className="min-h-[120px] rounded-2xl border border-gray-600 bg-white/5 hover:bg-white/10 transition p-4 text-left"
              >
                <div className="text-2xl mb-5">
                  ▣
                </div>

                <p className="text-xs font-bold tracking-wider">
                  COMPLIANCE
                </p>
              </button>

            </div>
          </div>

        </section>

        {/* Compliance Status */}
        <section className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-6">

          <div className="xl:col-span-2 bg-white border border-gray-200 rounded-2xl p-7 shadow-sm">

            <div className="flex items-start justify-between gap-4">

              <div>
                <p className="text-sm font-semibold text-green-600 uppercase tracking-wider">
                  Compliance
                </p>

                <h2 className="text-2xl font-bold text-gray-900 mt-1">
                  Compliance Status
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Live readiness across governance requirements.
                </p>
              </div>

              <button
                type="button"
                className="text-sm font-semibold text-green-700 hover:text-green-800"
              >
                Full Report →
              </button>

            </div>

            <div className="mt-7 space-y-5">
              {complianceItems.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
                <p className="text-sm font-semibold text-gray-700">
                  No compliance requirements yet
                </p>

                <p className="text-xs text-gray-500 mt-1">
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

                      <span className="font-medium text-gray-600">
                        {framework}
                      </span>

                      <span className="font-bold text-gray-900">
                        {percentage}%
                      </span>

                    </div>

                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">

                      <div
                        className="h-full bg-green-500 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />

                    </div>

                    <p className="text-xs text-gray-400 mt-1">
                      {compliantItems.length} of {frameworkItems.length} requirements compliant
                    </p>

                  </div>
                );
              })
            )}

          </div>

          </div>

          {/* Attention Required */}
          <div className="bg-white border border-gray-200 rounded-2xl p-7 shadow-sm">

            <p className="text-sm font-semibold text-red-600 uppercase tracking-wider">
              Action Center
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-1">
              Attention Required
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Items requiring management attention.
            </p>

            <div className="mt-6 space-y-3">
              {complianceItems.filter(
              (item) =>
                item.status === "Due Soon" ||
                item.status === "Non-Compliant" ||
                item.status === "Under Review"
            ).length === 0 ? (
              <div className="rounded-xl border border-gray-200 p-4">
                <p className="text-sm font-semibold text-gray-800">
                  No critical items
                </p>

                <p className="text-xs text-gray-500 mt-1">
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
                    className="rounded-xl border border-gray-200 p-4 hover:bg-gray-50 transition"
                  >
                    <div className="flex items-start justify-between gap-3">

                      <div>
                        <p className="text-sm font-semibold text-gray-800">
                          {item.requirementName}
                        </p>

                        <p className="text-xs text-gray-500 mt-1">
                          {item.framework} · {item.owner}
                        </p>
                      </div>

                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          item.status === "Non-Compliant"
                            ? "bg-red-50 text-red-700"
                            : item.status === "Due Soon"
                            ? "bg-amber-50 text-amber-700"
                            : "bg-blue-50 text-blue-700"
                        }`}
                      >
                        {item.status}
                      </span>

                    </div>

                    {item.dueDate && (
                      <p className="text-xs text-gray-400 mt-3">
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

       {/* Compliance Management */}

        <section className="mt-8">

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-5">

            <div>
              <p className="text-sm font-semibold text-green-600 uppercase tracking-wider">
                Compliance Management
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-1">
                Compliance Requirements
              </h2>

              <p className="text-sm text-gray-500 mt-1">
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


          {/* Compliance Table */}

          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">

            {complianceItems.length === 0 ? (

              <div className="p-12 text-center">

                <div className="w-14 h-14 mx-auto rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400 text-2xl">
                  ✓
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mt-4">
                  No compliance requirements
                </h3>

                <p className="text-sm text-gray-500 mt-1">
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
                    <tr className="border-b border-gray-200 bg-gray-50/70">

                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Requirement
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Framework
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Owner
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Due Date
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>


                  <tbody className="divide-y divide-gray-100">

                    {complianceItems.map((item) => (

                      <tr
                        key={item.id}
                        className="hover:bg-gray-50 transition"
                      >

                        {/* Requirement */}

                        <td className="px-6 py-5">

                          <p className="font-semibold text-gray-900">
                            {item.requirementName}
                          </p>

                          <p className="text-xs text-gray-400 mt-1">
                            Compliance requirement
                          </p>

                        </td>
                          

                        {/* Framework */}

                        <td className="px-6 py-5">

                          <span className="text-sm font-medium text-gray-700">
                            {item.framework || "—"}
                          </span>

                        </td>


                        {/* Owner */}

                        <td className="px-6 py-5">

                          <span className="text-sm text-gray-600">
                            {item.owner || "—"}
                          </span>

                        </td>


                        {/* Due Date */}

                        <td className="px-6 py-5">

                          <span className="text-sm font-medium text-gray-700">
                            {item.dueDate || "—"}
                          </span>

                        </td>


                       {/* Status */}

                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${
                            item.status === "Compliant"
                              ? "bg-green-50 text-green-700"
                              : item.status === "Due Soon"
                              ? "bg-amber-50 text-amber-700"
                              : item.status === "Non-Compliant"
                              ? "bg-red-50 text-red-700"
                              : "bg-blue-50 text-blue-700"
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
                              alert(
                                `Requirement: ${item.requirementName}\nFramework: ${item.framework}\nOwner: ${item.owner}\nDue Date: ${item.dueDate}\nStatus: ${item.status}`
                              );
                            }}
                            className="px-3 py-2 text-sm font-semibold text-green-700 bg-green-50 rounded-lg hover:bg-green-100 transition"
                          >
                            View
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setSelectedCompliance(item);
                              setShowComplianceModal(true);
                            }}
                            className="px-3 py-2 text-sm font-semibold text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={async () => {
                              const confirmed = window.confirm(
                                `Delete "${item.requirementName}"? This action cannot be undone.`
                              );

                              if (!confirmed) {
                                return;
                              }

                              try {
                                await deleteDoc(
                                  doc(db, "governanceCompliance", item.id)
                                );
                              } catch (error) {
                                console.error("Error deleting compliance requirement:", error);
                                alert("Failed to delete compliance requirement.");
                              }
                            }}
                            className="px-3 py-2 text-sm font-semibold text-red-700 bg-red-50 rounded-lg hover:bg-red-100 transition"
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

          </div>

        </section> 
{/* Audit Management */}

<section className="mt-8">

  <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-5">

    <div>
      <p className="text-sm font-semibold text-green-600 uppercase tracking-wider">
        Audit & Assurance
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-1">
        Audit Management
      </h2>

      <p className="text-sm text-gray-500 mt-1">
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


  {/* Audit Table */}

  <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">

    {audits.length === 0 ? (

      <div className="p-12 text-center">

        <div className="w-14 h-14 mx-auto rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400 text-2xl">
          ◉
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mt-4">
          No audits yet
        </h3>

        <p className="text-sm text-gray-500 mt-1">
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
            <tr className="border-b border-gray-200 bg-gray-50/70">

              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Audit
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Type
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Owner
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Timeline
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Status
              </th>

              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Action
              </th>

            </tr>
          </thead>


          <tbody className="divide-y divide-gray-100">

            {audits.map((audit) => (

              <tr
                key={audit.id}
                className="hover:bg-gray-50 transition"
              >

                {/* Audit */}

                <td className="px-6 py-5">

                  <p className="font-semibold text-gray-900">
                    {audit.auditName}
                  </p>

                  <p className="text-xs text-gray-400 mt-1">
                    Governance audit
                  </p>

                </td>


                {/* Type */}

                <td className="px-6 py-5">

                  <span className="text-sm font-medium text-gray-700">
                    {audit.auditType || "—"}
                  </span>

                </td>


                {/* Owner */}

                <td className="px-6 py-5">

                  <span className="text-sm text-gray-600">
                    {audit.auditOwner || "—"}
                  </span>

                </td>


                {/* Timeline */}

                <td className="px-6 py-5">

                  <div className="text-sm text-gray-700">
                    {audit.startDate || "—"}
                  </div>

                  <div className="text-xs text-gray-400 mt-1">
                    Target: {audit.targetDate || "—"}
                  </div>

                </td>


                {/* Status */}

                <td className="px-6 py-5">

                  <span
                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${
                      audit.status === "Completed"
                        ? "bg-green-50 text-green-700"
                        : audit.status === "In Progress"
                        ? "bg-blue-50 text-blue-700"
                        : audit.status === "On Hold"
                        ? "bg-red-50 text-red-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >

                    <span className="w-1.5 h-1.5 rounded-full bg-current" />

                    {audit.status || "Planned"}

                  </span>

                </td>


                {/* Action */}

                <td className="px-6 py-5 text-right">

                  <button
                    type="button"
                    onClick={() => {
                      alert(
                        `Audit: ${audit.auditName}\nType: ${audit.auditType}\nOwner: ${audit.auditOwner}\nStart Date: ${audit.startDate}\nTarget Date: ${audit.targetDate}\nStatus: ${audit.status}`
                      );
                    }}
                    className="px-3 py-2 text-sm font-semibold text-green-700 bg-green-50 rounded-lg hover:bg-green-100 transition"
                  >
                    View
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedAudit(audit);
                      setShowAuditModal(true);
                    }}
                    className="px-3 py-2 text-sm font-semibold text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      const confirmed = window.confirm(
                        `Delete "${audit.auditName}"? This action cannot be undone.`
                      );

                      if (!confirmed) {
                        return;
                      }

                      try {
                        await deleteDoc(
                          doc(db, "governanceAudits", audit.id)
                        );
                      } catch (error) {
                        console.error("Error deleting audit:", error);
                        alert("Failed to delete audit.");
                      }
                    }}
                    className="px-3 py-2 text-sm font-semibold text-red-700 bg-red-50 rounded-lg hover:bg-red-100 transition"
                  >
                    Delete
                  </button>
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    )}

  </div>

</section>
      </main>
    </div>
  );
}

export default Governance;