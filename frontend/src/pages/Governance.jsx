import Sidebar from "../components/Sidebar";

function Governance() {
  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 ml-64 p-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">

          <div>

            <h1 className="text-4xl font-bold text-green-700">
              Governance Management
            </h1>

            <p className="text-gray-500 mt-2">
              Manage policies, compliance, audits and organizational governance.
            </p>

          </div>

          {/* Live System Badge */}

          <div className="hidden md:flex items-center gap-2 bg-green-50 border border-green-300 px-5 py-2 rounded-full shadow-md">

            <span className="relative flex h-3 w-3">

              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>

              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-600"></span>

            </span>

            <span className="font-semibold text-green-700">
              Live System
            </span>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Governance;