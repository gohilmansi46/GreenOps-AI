import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import ProtectedRoute from "../components/ProtectedRoute";
import Environmental from "../pages/Environmental";
import Social from "../pages/Social";
import Governance from "../pages/Governance";
import Reports from "../pages/Reports";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
  path="/environmental"
  element={
    <ProtectedRoute>
      <Environmental />
    </ProtectedRoute>
  }
/>

 <Route
  path="/social"
  element={
    <ProtectedRoute>
      <Social />
    </ProtectedRoute>
  }
/>

 <Route
  path="/governance"
  element={
    <ProtectedRoute>
      <Governance />
    </ProtectedRoute>
  }
/>

<Route
  path="/reports"
  element={
    <ProtectedRoute>
      <Reports />
    </ProtectedRoute>
  }
/>

      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;