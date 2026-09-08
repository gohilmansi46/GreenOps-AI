import { useState } from "react";

function GovernanceAuditModal({ onClose, onSave, audit }) {
  const [auditName, setAuditName] = useState(audit?.auditName || "");
  const [auditType, setAuditType] = useState(audit?.auditType || "");
  const [auditOwner, setAuditOwner] = useState(audit?.auditOwner || "");
  const [startDate, setStartDate] = useState(audit?.startDate || "");
  const [targetDate, setTargetDate] = useState(audit?.targetDate || "");
  const [status, setStatus] = useState(audit?.status || "Planned");

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs px-4 py-6">
      <div className="w-full max-w-2xl max-h-[90vh] bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-transparent dark:border-gray-700">

        {/* Header */}
        <div className="flex items-center justify-between px-7 py-5 border-b border-gray-200 dark:border-gray-700 shrink-0">
          <div>
            <p className="text-sm font-semibold text-green-600 dark:text-green-400 uppercase tracking-wide">
              Governance
            </p>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              {audit ? "Edit Audit" : "Start New Audit"}
            </h2>

            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Create an audit and assign responsibility for its completion.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 text-xl flex items-center justify-center"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto">
          <div className="p-7 space-y-6">

            {/* Audit Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Audit Name
              </label>

              <input
                type="text"
                value={auditName}
                onChange={(e) => setAuditName(e.target.value)}
                placeholder="e.g. Annual Governance Audit"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
              />
            </div>

            {/* Audit Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Audit Type
              </label>

              <select
                value={auditType}
                onChange={(e) => setAuditType(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
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
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Audit Owner
              </label>

              <input
                type="text"
                value={auditOwner}
                onChange={(e) => setAuditOwner(e.target.value)}
                placeholder="e.g. Internal Audit Manager"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
              />
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Start Date
                </label>

                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Target Date
                </label>

                <input
                  type="date"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                />
              </div>

            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Status
              </label>

              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
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
        <div className="flex justify-end gap-3 px-7 py-5 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shrink-0">

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-3 border border-gray-300 dark:border-gray-600 rounded-xl font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
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