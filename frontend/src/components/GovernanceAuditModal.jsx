import { useEffect, useState } from "react";

function GovernanceAuditModal({ onClose, onSave, audit }) {
  const [auditName, setAuditName] = useState("");
  const [auditType, setAuditType] = useState("");
  const [auditOwner, setAuditOwner] = useState("");
  const [startDate, setStartDate] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [status, setStatus] = useState("Planned");

  useEffect(() => {
  if (audit) {
    setAuditName(audit.auditName || "");
    setAuditType(audit.auditType || "");
    setAuditOwner(audit.auditOwner || "");
    setStartDate(audit.startDate || "");
    setTargetDate(audit.targetDate || "");
    setStatus(audit.status || "Planned");
  } else {
    setAuditName("");
    setAuditType("");
    setAuditOwner("");
    setStartDate("");
    setTargetDate("");
    setStatus("Planned");
  }
}, [audit]);

  const handleSave = () => {
    if (!auditName.trim()) {
      alert("Please enter an audit name.");
      return;
    }

    if (!auditType) {
      alert("Please select an audit type.");
      return;
    }

    if (!auditOwner.trim()) {
      alert("Please enter an audit owner.");
      return;
    }

    onSave({
      auditName: auditName.trim(),
      auditType,
      auditOwner: auditOwner.trim(),
      startDate,
      targetDate,
      status,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6">
      <div className="w-full max-w-2xl max-h-[90vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-7 py-5 border-b border-gray-200">
          <div>
            <p className="text-sm font-semibold text-green-600 uppercase tracking-wide">
              Governance
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-1">
              {audit ? "Edit Audit" : "Start New Audit"}
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Create an audit and assign responsibility for its completion.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 text-xl flex items-center justify-center"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto">
          <div className="p-7 space-y-6">

            {/* Audit Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Audit Name
              </label>

              <input
                type="text"
                value={auditName}
                onChange={(e) => setAuditName(e.target.value)}
                placeholder="e.g. Annual Governance Audit"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            {/* Audit Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Audit Type
              </label>

              <select
                value={auditType}
                onChange={(e) => setAuditType(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
              >
                <option value="" disabled>
                  Select audit type
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
            </div>

            {/* Owner */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Audit Owner
              </label>

              <input
                type="text"
                value={auditOwner}
                onChange={(e) => setAuditOwner(e.target.value)}
                placeholder="e.g. Internal Audit Manager"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Start Date
                </label>

                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Target Date
                </label>

                <input
                  type="date"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Status
              </label>

              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
              >
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
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-7 py-5 border-t border-gray-200 bg-white">

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-3 border border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition"
          >
            {audit ? "Update Audit" : "Create Audit"}
          </button>

        </div>

      </div>
    </div>
  );
}

export default GovernanceAuditModal;