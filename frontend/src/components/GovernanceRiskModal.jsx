import { useState } from "react";

function GovernanceRiskModal({ onClose, onSave, risk }) {
  const [riskTitle, setRiskTitle] = useState(risk?.riskTitle || "");
  const [riskCategory, setRiskCategory] = useState(risk?.riskCategory || "");
  const [description, setDescription] = useState(risk?.description || "");
  const [riskOwner, setRiskOwner] = useState(risk?.riskOwner || "");
  const [severity, setSeverity] = useState(risk?.severity || "Medium");
  const [likelihood, setLikelihood] = useState(risk?.likelihood || "Possible");
  const [status, setStatus] = useState(risk?.status || "Open");
  const [mitigationPlan, setMitigationPlan] = useState(risk?.mitigationPlan || "");
  const [targetDate, setTargetDate] = useState(risk?.targetDate || "");

  if (!onClose) {
    return null;
  }

  const handleSave = () => {
    if (!riskTitle.trim()) {
      alert("Please enter a risk title.");
      return;
    }

    if (!riskCategory) {
      alert("Please select a risk category.");
      return;
    }

    if (!riskOwner.trim()) {
      alert("Please enter a risk owner.");
      return;
    }

    onSave({
      riskTitle: riskTitle.trim(),
      riskCategory,
      description: description.trim(),
      riskOwner: riskOwner.trim(),
      severity,
      likelihood,
      status,
      mitigationPlan: mitigationPlan.trim(),
      targetDate,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs px-4 py-6">
      <div className="w-full max-w-3xl max-h-[92vh] bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-transparent dark:border-gray-700">

        {/* Header */}
        <div className="flex items-center justify-between px-7 py-5 border-b border-gray-200 dark:border-gray-700 shrink-0">
          <div>
            <p className="text-sm font-semibold text-green-600 dark:text-green-400 uppercase tracking-wide">
              Governance
            </p>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              {risk ? "Edit Risk" : "Add New Risk"}
            </h2>

            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Record and monitor an organizational governance risk.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 text-xl flex items-center justify-center transition"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Form Body */}
        <div className="overflow-y-auto">
          <div className="p-7 space-y-6">

            {/* Risk Information */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-green-50 dark:bg-green-950/60 text-green-600 dark:text-green-300 flex items-center justify-center font-bold">
                  1
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Risk Information
                  </h3>

                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Basic information about the identified risk.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                {/* Risk Title */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Risk Title
                  </label>

                  <input
                    type="text"
                    value={riskTitle}
                    onChange={(e) => setRiskTitle(e.target.value)}
                    placeholder="e.g. Regulatory compliance gap"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Risk Category
                  </label>

                  <select
                    value={riskCategory}
                    onChange={(e) => setRiskCategory(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  >
                    <option value="" disabled>
                      Select category
                    </option>

                    <option value="Governance">
                      Governance
                    </option>

                    <option value="Compliance">
                      Compliance
                    </option>

                    <option value="Regulatory">
                      Regulatory
                    </option>

                    <option value="Operational">
                      Operational
                    </option>

                    <option value="Financial">
                      Financial
                    </option>

                    <option value="Reputational">
                      Reputational
                    </option>
                  </select>
                </div>

                {/* Owner */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Risk Owner
                  </label>

                  <input
                    type="text"
                    value={riskOwner}
                    onChange={(e) => setRiskOwner(e.target.value)}
                    placeholder="e.g. Compliance Manager"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  />
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>

                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    placeholder="Describe the risk, its potential impact and relevant context..."
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl outline-none resize-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  />
                </div>

              </div>
            </div>

            {/* Risk Assessment */}
            <div className="border-t border-gray-100 dark:border-gray-700 pt-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-yellow-50 dark:bg-yellow-950/60 text-yellow-600 dark:text-yellow-300 flex items-center justify-center font-bold">
                  2
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Risk Assessment
                  </h3>

                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Assess severity and likelihood of the risk.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                {/* Severity */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Severity
                  </label>

                  <select
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  >
                    <option value="Low">
                      Low
                    </option>

                    <option value="Medium">
                      Medium
                    </option>

                    <option value="High">
                      High
                    </option>

                    <option value="Critical">
                      Critical
                    </option>
                  </select>
                </div>

                {/* Likelihood */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Likelihood
                  </label>

                  <select
                    value={likelihood}
                    onChange={(e) => setLikelihood(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  >
                    <option value="Rare">
                      Rare
                    </option>

                    <option value="Unlikely">
                      Unlikely
                    </option>

                    <option value="Possible">
                      Possible
                    </option>

                    <option value="Likely">
                      Likely
                    </option>

                    <option value="Almost Certain">
                      Almost Certain
                    </option>
                  </select>
                </div>

              </div>
            </div>

            {/* Mitigation */}
            <div className="border-t border-gray-100 dark:border-gray-700 pt-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-300 flex items-center justify-center font-bold">
                  3
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Mitigation & Monitoring
                  </h3>

                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Define how the organization will manage the risk.
                  </p>
                </div>
              </div>

              <div className="space-y-5">

                {/* Mitigation Plan */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Mitigation / Action Plan
                  </label>

                  <textarea
                    value={mitigationPlan}
                    onChange={(e) => setMitigationPlan(e.target.value)}
                    rows={4}
                    placeholder="Describe the actions being taken to reduce or manage this risk..."
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl outline-none resize-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                  {/* Status */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Risk Status
                    </label>

                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                    >
                      <option value="Open">
                        Open
                      </option>

                      <option value="Monitoring">
                        Monitoring
                      </option>

                      <option value="Mitigated">
                        Mitigated
                      </option>

                      <option value="Closed">
                        Closed
                      </option>
                    </select>
                  </div>

                  {/* Target Date */}
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

              </div>
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
            {risk ? "Update Risk" : "Save Risk"}
          </button>

        </div>

      </div>
    </div>
  );
}

export default GovernanceRiskModal;