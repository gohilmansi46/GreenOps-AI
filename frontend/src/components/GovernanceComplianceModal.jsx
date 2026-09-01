import { useEffect, useState } from "react";

function GovernanceComplianceModal({ onClose, onSave, policy }) {
  const [requirementName, setRequirementName] = useState("");
  const [framework, setFramework] = useState("");
  const [owner, setOwner] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState("Compliant");

  useEffect(() => {
  if (policy) {
    setRequirementName(policy.requirementName || "");
    setFramework(policy.framework || "");
    setOwner(policy.owner || "");
    setDueDate(policy.dueDate || "");
    setStatus(policy.status || "Compliant");
  } else {
    setRequirementName("");
    setFramework("");
    setOwner("");
    setDueDate("");
    setStatus("Compliant");
  }
  }, [policy]);

  const handleSave = () => {
    if (!requirementName.trim()) {
      alert("Please enter a compliance requirement.");
      return;
    }

    if (!framework) {
      alert("Please select a framework.");
      return;
    }

    if (!owner.trim()) {
      alert("Please enter an owner.");
      return;
    }

    onSave({
      requirementName: requirementName.trim(),
      framework,
      owner: owner.trim(),
      dueDate,
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
              {policy ? "Edit Compliance Requirement" : "Add Compliance Requirement"}
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Track a regulatory or governance compliance obligation.
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

            {/* Requirement */}

            <div>

              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Requirement Name
              </label>

              <input
                type="text"
                value={requirementName}
                onChange={(e) => setRequirementName(e.target.value)}
                placeholder="e.g. Annual ESG Disclosure"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />

            </div>


            {/* Framework */}

            <div>

              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Framework
              </label>

              <select
                value={framework}
                onChange={(e) => setFramework(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
              >

                <option value="" disabled>
                  Select framework
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
                  Internal Requirement
                </option>

              </select>

            </div>


            {/* Owner */}

            <div>

              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Compliance Owner
              </label>

              <input
                type="text"
                value={owner}
                onChange={(e) => setOwner(e.target.value)}
                placeholder="e.g. Compliance Manager"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />

            </div>


            {/* Due Date */}

            <div>

              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Due Date
              </label>

              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />

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
            {policy ? "Update Requirement" : "Add Requirement"}
          </button>

        </div>

      </div>
    </div>
  );
}

export default GovernanceComplianceModal;