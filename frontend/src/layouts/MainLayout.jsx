import Sidebar from "../components/Sidebar";

function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-100 relative">

      {/* Fixed Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="ml-0 md:ml-64 min-h-screen">
        {children}
      </main>

    </div>
  );
}

export default MainLayout;