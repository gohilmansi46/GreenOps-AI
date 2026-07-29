function Navbar() {
  return (
    <nav className="bg-green-700 text-white px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">GreenOps AI</h1>

        <div className="flex gap-6">
          <a href="/" className="hover:text-green-200">Home</a>
          <a href="/dashboard" className="hover:text-green-200">Dashboard</a>
          <a href="/login" className="hover:text-green-200">Login</a>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;