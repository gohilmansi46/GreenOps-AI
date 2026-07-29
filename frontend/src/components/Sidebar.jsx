import { Link, NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-green-900 text-white shadow-xl overflow-y-auto z-50">

      <div className="p-6">

        <h2 className="text-3xl font-bold mb-10">
          GreenOps AI
        </h2>

        <ul className="space-y-4">

          <li>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `block p-3 rounded-lg transition-all duration-300 ${
                  isActive
                    ? "bg-green-700 text-white font-semibold"
                    : "hover:bg-green-700"
                }`
              }
            >
              Dashboard
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/environmental"
              className={({ isActive }) =>
                `block p-3 rounded-lg transition-all duration-300 ${
                  isActive
                    ? "bg-green-700 text-white font-semibold"
                    : "hover:bg-green-700"
                }`
              }
            >
              Environmental
            </NavLink>
          </li>

          <li>
            <Link
              to="#"
              className="block p-3 rounded-lg hover:bg-green-700 transition"
            >
              Social
            </Link>
          </li>

          <li>
            <Link
              to="#"
              className="block p-3 rounded-lg hover:bg-green-700 transition"
            >
              Governance
            </Link>
          </li>

          <li>
            <Link
              to="#"
              className="block p-3 rounded-lg hover:bg-green-700 transition"
            >
              Reports
            </Link>
          </li>

        </ul>

      </div>

    </aside>
  );
}

export default Sidebar;