import { useState } from "react";

function GovernancePolicyModal({ onClose, onSave, policy }) {
  const [policyName, setPolicyName] = useState(policy?.policyName || "");
  const [policyCategory, setPolicyCategory] = useState(policy?.policyCategory || "");
  const [policyOwner, setPolicyOwner] = useState(policy?.policyOwner || "");
  const [reviewDate, setReviewDate] = useState(policy?.reviewDate || "");
  const [status, setStatus] = useState(policy?.status || "Active");

if (!onClose) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs px-4 py-6">
      <div className="w-full max-w-2xl max-h-[90vh] bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-transparent dark:border-gray-700">

        {/* Header */}
        <div className="flex items-center justify-between px-7 py-5 border-b border-gray-200 dark:border-gray-700 shrink-0">
          <div>
            <p className="text-sm font-semibold text-green-600 dark:text-green-400 uppercase tracking-wide">
              Governance
            </p>

           <h2 className="text-2xl font-bold text-gray-800 dark:text-white mt-1">
            {policy ? "Edit Policy" : "Add New Policy"}
          </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 text-xl flex items-center justify-center"
          >
            ×
          </button>
        </div>

        {/* Form Body */}
        <div className="overflow-y-auto">
          <div className="p-7 space-y-6">

            {/* Policy Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Policy Name
              </label>

              <input
                type="text"
                value={policyName}
                onChange={(e) => setPolicyName(e.target.value)}
                placeholder="Enter policy name"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
              />
            </div>

            {/* Policy Category */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Policy Category
              </label>

              <select
                value={policyCategory}
                onChange={(e) => setPolicyCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
              >
                <option value="" disabled>
                  Select category
                </option>

                <option value="Environmental">
                  Environmental
                </option>

                <option value="Social">
                  Social
                </option>

                <option value="Governance">
                  Governance
                </option>

                <option value="Compliance">
                  Compliance
                </option>
              </select>
            </div>

            {/* Policy Owner */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Policy Owner
              </label>

              <input
                type="text"
                value={policyOwner}
                onChange={(e) => setPolicyOwner(e.target.value)}
                placeholder="e.g. Sustainability Manager"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
              />
            </div>

            {/* Review Date */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Review Date
              </label>

             <input
                type="date"
                value={reviewDate}
                onChange={(e) => setReviewDate(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
              />
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
                <option value="Active">
                  Active
                </option>

                <option value="Under Review">
                  Under Review
                </option>

                <option value="Expired">
                  Expired
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
            onClick={() => {
              onSave({
                policyName,
                policyCategory,
                policyOwner,
                reviewDate,
                status,
              });
              }}
              className="px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition"
              >
              {policy ? "Update Policy" : "Save Policy"}
          </button>

        </div>

      </div>
    </div>
  );
}

export default GovernancePolicyModal;