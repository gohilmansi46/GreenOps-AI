import { useState, useEffect, useRef } from "react";
import { signOutUser } from "../services/authService";
import { useNavigate } from "react-router-dom";
import AIChatbot from "../components/AIChatbot";
import MainLayout from "../layouts/MainLayout";
import { useTheme } from "../context/ThemeContext";

import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "../config/firebase";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

import {
  FaLeaf,
  FaBolt,
  FaTint,
  FaAward,
  FaCalendarAlt,
  FaRobot,
  FaCheckCircle,
  FaExclamationTriangle,
  FaInfoCircle,
  FaBullseye,
  FaBell,
  FaMoon,
  FaSun,
} from "react-icons/fa";

import {
  FaDatabase,
  FaSeedling,
  FaArrowTrendUp,
} from "react-icons/fa6";

const emissionsData = [
  { month: "Jan", emissions: 120 },
  { month: "Feb", emissions: 110 },
  { month: "Mar", emissions: 105 },
  { month: "Apr", emissions: 95 },
  { month: "May", emissions: 90 },
  { month: "Jun", emissions: 80 },
];

const esgData = [
  { name: "Environmental", value: 40 },
  { name: "Social", value: 25 },
  { name: "Governance", value: 35 },
];

const COLORS = ["#16a34a", "#2563eb", "#9333ea"];
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="bg-white rounded-xl shadow-2xl border border-gray-200 px-4 py-3 min-w-[230px]">
      <p className="font-semibold text-gray-800 border-b pb-2 mb-3">
        {label}
      </p>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 text-green-600">
            <FaLeaf />
            <span>Carbon</span>
          </div>

          <span className="font-semibold text-gray-700">
            {payload[0]?.value} tCO₂
          </span>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 text-blue-600">
            <FaBolt />
            <span>Energy</span>
          </div>

          <span className="font-semibold text-gray-700">
            {payload[1]?.value} kWh
          </span>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 text-cyan-600">
            <FaTint />
            <span>Water</span>
          </div>

          <span className="font-semibold text-gray-700">
            {payload[2]?.value} L
          </span>
        </div>
      </div>
    </div>
  );
};
function Dashboard() {
  const { darkMode, setDarkMode } = useTheme();
  const navigate = useNavigate();
  const [latestData, setLatestData] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [hiddenNotifications, setHiddenNotifications] = useState([]);
  const notificationRef = useRef(null);
  const getGreeting = () => {
  const hour = new Date().getHours();

  if (hour < 12) return "Good Morning ☀";
  if (hour < 17) return "Good Afternoon 🌤";
  return "Good Evening 🌙";
};
  
useEffect(() => {
  fetchLatestData();
  fetchChartData();
}, []);

useEffect(() => {
  function handleClickOutside(event) {
    if (
      notificationRef.current &&
      !notificationRef.current.contains(event.target)
    ) {
      setShowNotifications(false);
    }
  }

  document.addEventListener("mousedown", handleClickOutside);

  return () => {
    document.removeEventListener(
      "mousedown",
      handleClickOutside
    );
  };
}, []);

const fetchLatestData = async () => {
    try {
      const q = query(
        collection(db, "environmentalData"),
        orderBy("createdAt", "desc"),
        limit(1)
      );

      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        setLatestData(snapshot.docs[0].data());
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchChartData = async () => {
  try {
    const q = query(
      collection(db, "environmentalData"),
      orderBy("createdAt", "asc")
    );

    const snapshot = await getDocs(q);

    const data = snapshot.docs.map((doc) => ({
  month: doc.data().createdAt.toDate().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
  }),
  emissions: doc.data().carbon,
  energy: doc.data().energy,
  water: doc.data().water,
}));

    setChartData(data);
  } catch (error) {
    console.error("Error fetching chart data:", error);
  }
};

const calculateESGScore = () => {
  if (!latestData) return 0;

  let score = 100;

  // Carbon Emissions
  if (latestData.carbon > 500) score -= 25;
  else if (latestData.carbon > 300) score -= 15;
  else if (latestData.carbon > 100) score -= 5;

  // Energy Usage
  if (latestData.energy > 2000) score -= 25;
  else if (latestData.energy > 1000) score -= 15;
  else if (latestData.energy > 500) score -= 5;

  // Water Consumption
  if (latestData.water > 10000) score -= 25;
  else if (latestData.water > 5000) score -= 15;
  else if (latestData.water > 3000) score -= 5;

  return Math.max(score, 0);
};

const getCarbonStatus = () => {
  if (!latestData) return "";

  if (latestData.carbon <= 100) return "🟢 Excellent";
  if (latestData.carbon <= 300) return "🟢 Normal";
  if (latestData.carbon <= 500) return "🟡 Moderate";
  return "🔴 High";
};

const getEnergyStatus = () => {
  if (!latestData) return "";

  if (latestData.energy <= 500) return "🟢 Efficient";
  if (latestData.energy <= 1000) return "🟡 Moderate";
  return "🔴 High";
};

const getWaterStatus = () => {
  if (!latestData) return "";

  if (latestData.water <= 3000) return "🟢 Efficient";
  if (latestData.water <= 8000) return "🟡 Moderate";
  return "🔴 High Usage";
};

const getESGStatus = () => {
  const score = calculateESGScore();

  if (score >= 90) return "🏆 Excellent";
  if (score >= 75) return "🟢 Good";
  if (score >= 50) return "🟡 Needs Improvement";
  return "🔴 Critical";
};

const getAIInsights = () => {
  if (!latestData) {
    return ["Loading ESG insights..."];
  }

  const insights = [];

  // Carbon
  if (latestData.carbon > 500) {
    insights.push("⚠️ Carbon emissions are very high. Consider reducing fossil fuel usage.");
  } else if (latestData.carbon > 200) {
    insights.push("🟡 Carbon emissions are moderate. There is room for improvement.");
  } else {
    insights.push("✅ Carbon emissions are within a good range.");
  }

  // Energy
  if (latestData.energy > 1000) {
    insights.push("⚡ Energy consumption is high. Consider improving energy efficiency.");
  } else {
    insights.push("✅ Energy consumption is under control.");
  }

  // Water
  if (latestData.water > 5000) {
    insights.push("💧 Water usage is high. Water conservation measures are recommended.");
  } else {
    insights.push("✅ Water consumption is efficient.");
  }

  // ESG Score
  const score = calculateESGScore();

  if (score >= 90) {
    insights.push("🏆 Excellent ESG performance.");
  } else if (score >= 75) {
    insights.push("✅ Good ESG performance with improvement opportunities.");
  } else {
    insights.push("⚠️ ESG performance needs improvement.");
  }

  return insights;
};

const getNotifications = () => {
  if (!latestData) return [];

  const notifications = [];

  if (latestData.carbon > 500) {
    notifications.push({
      id: 1,
      type: "danger",
      title: "High Carbon Emissions",
      message: `Carbon emissions reached ${latestData.carbon} tCO₂`,
      createdAt: latestData.createdAt,
      });
      } else {
      notifications.push({
      id: 1,
      type: "success",
      title: "Carbon Status",
      message: `Carbon emissions are under control (${latestData.carbon} tCO₂)`,
      createdAt: latestData.createdAt,
      });
      }

  if (latestData.energy > 1000) {
    notifications.push({
  id: 2,
  type: "warning",
  title: "Energy Alert",
  message: `Energy usage is ${latestData.energy} kWh`,
  createdAt: latestData.createdAt,
  });
  }

  if (latestData.water > 5000) {
    notifications.push({
  id: 3,
  type: "warning",
  title: "Water Consumption",
  message: `Water usage reached ${latestData.water} L`,
  createdAt: latestData.createdAt,
});
  }

  const score = calculateESGScore();

  notifications.push({
  id: 4,
  type: score >= 80 ? "success" : "info",
  title: "ESG Score",
  message:
    score >= 80
      ? `Excellent ESG Performance (${score}/100)`
      : `Current ESG Score: ${score}/100`,
  createdAt: latestData.createdAt,
});

  return notifications.filter(
  (notification) => !hiddenNotifications.includes(notification.id)
);
};

  const handleLogout = async () => {
    await signOutUser();
    navigate("/login");
  };

  return (
  <MainLayout>
  <div
  className={`min-h-screen transition-colors duration-300 ${
    darkMode ? "bg-gray-900" : "bg-gray-100"
  }`}
>

  {/* Top Navbar */}
<div
  className={`fixed top-0 left-64 right-0 shadow px-8 py-4 flex justify-between items-center z-40 transition-colors duration-300 ${
    darkMode ? "bg-gray-800" : "bg-white"
  }`}
>
  {/* Left Side */}
  <div>
    <h1 className="text-3xl font-bold text-green-700 dark:text-green-400">
  ESG Dashboard
</h1>

    <p className="text-gray-500 mt-1">
      Monitor your sustainability performance in real time.
    </p>
  </div>

  {/* Right Side */}
  <div className="flex items-center gap-5 relative">

    {/* Live Status */}
<div className="hidden md:flex items-center gap-3 bg-green-50 border border-green-300 px-5 py-2 rounded-full shadow-lg shadow-green-200/60">

  <span className="relative flex h-3 w-3">
    <span className="absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75 animate-ping"></span>
    <span className="relative inline-flex h-3 w-3 rounded-full bg-green-600"></span>
  </span>

  <span className="text-green-700 font-semibold tracking-wide">
    System Active
  </span>

</div>

    {/* Welcome */}
    <div className="text-right">

      <p className="text-sm text-gray-500">
        {getGreeting()}
      </p>

      <p className="font-semibold text-gray-700">
        ESG Manager
      </p>

    </div>

<div
  className="relative"
  ref={notificationRef}
>
  <button
    onClick={() => setShowNotifications(!showNotifications)}
className={`relative p-3 rounded-full transition-all duration-300 ${
  darkMode
    ? "bg-gray-700 hover:bg-gray-600"
    : "bg-gray-100 hover:bg-gray-200"
} ${
  getNotifications().length > 0 && !showNotifications
    ? "animate-pulse"
    : ""
}`}  >
    <FaBell
  className={`text-xl ${
    darkMode ? "text-white" : "text-gray-700"
  }`}
/>

    {getNotifications().length > 0 && (
  <span
    className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold min-w-[20px] h-5 px-1 rounded-full flex items-center justify-center animate-bounce"
  >
    {getNotifications().length}
  </span>
)}
      {showNotifications && (
  <div className={`absolute right-0 mt-3 w-96 rounded-2xl shadow-2xl border z-50 overflow-hidden transition-all duration-300 ${
  darkMode
    ? "bg-gray-800 border-gray-700"
    : "bg-white border-gray-200"
}`}>

    {/* Header */}
    <div
  className={`flex justify-between items-center px-5 py-4 border-b ${
    darkMode ? "border-gray-700" : "border-gray-200"
  }`}
>
      <h3
  className={`font-bold text-lg ${
    darkMode ? "text-white" : "text-gray-900"
  }`}
>
        Notifications
      </h3>

      <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-semibold">
        {getNotifications().length} New
      </span>
    </div>

    {getNotifications().map((notification) => {

  let Icon = FaInfoCircle;
  let iconColor = "text-blue-500";

  if (notification.type === "success") {
    Icon = FaCheckCircle;
    iconColor = "text-green-500";
  }

  if (notification.type === "warning") {
    Icon = FaExclamationTriangle;
    iconColor = "text-yellow-500";
  }

  if (notification.type === "danger") {
    Icon = FaExclamationTriangle;
    iconColor = "text-red-500";
  }

  return (
    <div
      key={notification.id}
      className={`px-5 py-4 transition border-b ${
  darkMode
    ? "hover:bg-gray-700 border-gray-700"
    : "hover:bg-gray-50 border-gray-200"
}`}
    >

      <div className="flex justify-between items-start">

        <div className="flex gap-3">

          <Icon className={`${iconColor} mt-1`} />

          <div>

            <h4 className={`font-semibold ${
  darkMode ? "text-white" : "text-gray-800"
}`}>
              {notification.title}
            </h4>

            <p className={`text-sm mt-1 ${
  darkMode ? "text-gray-300" : "text-gray-600"
}`}>
              {notification.message}
            </p>

            <p className={`text-xs mt-2 ${
  darkMode ? "text-gray-500" : "text-gray-400"
}`}>
              {getTimeAgo(notification.createdAt)}
            </p>

          </div>

        </div>

<button
  onClick={(e) => {
    e.stopPropagation();

    setHiddenNotifications((prev) => [
      ...prev,
      notification.id,
    ]);
  }}
  className="text-red-500 hover:text-red-700 text-sm font-medium"
>
  Delete
</button>

      </div>

    </div>
  );

})}

    {/* Footer */}
    <div className={`border-t px-5 py-3 text-center ${
  darkMode
    ? "bg-gray-900 border-gray-700"
    : "bg-gray-50 border-gray-200"
}`}>
     <button
  onClick={() => navigate("/environmental")}
  className={`font-semibold hover:underline ${
  darkMode
    ? "text-green-400"
    : "text-green-700"
}`}
>
  View All Notifications
</button>

    </div>

  </div>
)}
  </button>

</div>

    {/* Theme Toggle */}
<button
  onClick={() => setDarkMode(!darkMode)}
  className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 ${
    darkMode
      ? "bg-gray-700 hover:bg-gray-600"
      : "bg-gray-100 hover:bg-gray-200"
  }`}
>
  {darkMode ? (
    <FaSun className="text-yellow-400 text-lg" />
  ) : (
    <FaMoon className="text-white-700 text-lg" />
  )}
</button>

{/* Logout Button */}
<button
  onClick={handleLogout}
  className="bg-red-500 hover:bg-red-600 hover:scale-105 transition-all duration-300 text-white px-5 py-2 rounded-lg shadow-md"
>
  Logout
</button>

  </div>

</div>

        <div className="p-8 pt-32"> 

{/* Dashboard Statistics */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-5">

  {/* Last Updated */}
  <div
    className={`p-3 rounded-xl shadow-lg border-l-4 border-green-500 hover:shadow-2xl transition-all duration-300 ${
      darkMode ? "bg-gray-800" : "bg-white"
    }`}
  >
    <div className="flex justify-between items-center">
      <div>
        <h3 className={darkMode ? "text-gray-300 text-sm" : "text-gray-500 text-sm"}>
          Last Updated
        </h3>

        <p className="text-xl font-bold text-green-600 mt-1">
          {chartData.length > 0
            ? chartData[chartData.length - 1].month
            : "Loading..."}
        </p>

        <p className="text-xs text-green-500 mt-1">
          Latest Entry
        </p>
      </div>

      <div
        className={`w-12 h-12 rounded-full flex items-center justify-center ${
          darkMode ? "bg-green-900" : "bg-green-100"
        }`}
      >
        <FaCalendarAlt className="text-xl text-green-500" />
      </div>
    </div>
  </div>

  {/* Total Records */}
  <div
    className={`p-3 rounded-xl shadow-lg border-l-4 border-blue-500 hover:shadow-2xl transition-all duration-300 ${
      darkMode ? "bg-gray-800" : "bg-white"
    }`}
  >
    <div className="flex justify-between items-center">
      <div>
        <h3 className={darkMode ? "text-gray-300 text-sm" : "text-gray-500 text-sm"}>
          Total Records
        </h3>

        <p className="text-xl font-bold text-blue-500 mt-1">
          {chartData.length}
        </p>

        <p className="text-xs text-blue-500 mt-1">
          Database Entries
        </p>
      </div>

      <div
        className={`w-12 h-12 rounded-full flex items-center justify-center ${
          darkMode ? "bg-blue-900" : "bg-blue-100"
        }`}
      >
        <FaDatabase className="text-xl text-blue-500" />
      </div>
    </div>
  </div>

  {/* ESG Status */}
  <div
    className={`p-3 rounded-xl shadow-lg border-l-4 border-emerald-500 hover:shadow-2xl transition-all duration-300 ${
      darkMode ? "bg-gray-800" : "bg-white"
    }`}
  >
    <div className="flex justify-between items-center">
      <div>
        <h3 className={darkMode ? "text-gray-300 text-sm" : "text-gray-500 text-sm"}>
          ESG Status
        </h3>

        <p className="text-xl font-bold text-emerald-500 mt-1">
          {calculateESGScore() >= 75 ? "Good" : "Needs Improvement"}
        </p>

        <p className="text-xs text-emerald-500 mt-1">
          Sustainability
        </p>
      </div>

      <div
        className={`w-12 h-12 rounded-full flex items-center justify-center ${
          darkMode ? "bg-emerald-900" : "bg-emerald-100"
        }`}
      >
        <FaSeedling className="text-xl text-emerald-500" />
      </div>
    </div>
  </div>

  {/* Monthly Trend */}
  <div
    className={`p-3 rounded-xl shadow-lg border-l-4 border-purple-500 hover:shadow-2xl transition-all duration-300 ${
      darkMode ? "bg-gray-800" : "bg-white"
    }`}
  >
    <div className="flex justify-between items-center">
      <div>
        <h3 className={darkMode ? "text-gray-300 text-sm" : "text-gray-500 text-sm"}>
          Monthly Trend
        </h3>

        <p className="text-xl font-bold text-purple-500 mt-1">
          +12%
        </p>

        <p className="text-xs text-purple-500 mt-1">
          Growth
        </p>
      </div>

      <div
        className={`w-12 h-12 rounded-full flex items-center justify-center ${
          darkMode ? "bg-purple-900" : "bg-purple-100"
        }`}
      >
        <FaArrowTrendUp className="text-xl text-purple-500" />
      </div>
    </div>
  </div>

</div>  

{/* KPI Cards */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
<div
  className={`rounded-2xl shadow-lg p-6 border-l-4 border-green-600 hover:shadow-2xl transition-all duration-300 ${
    darkMode ? "bg-gray-800" : "bg-white"
  }`}
>

  <div className="flex justify-between items-center">

    <div>

<p className={darkMode ? "text-gray-300 font-medium" : "text-gray-500 font-medium"}>        Carbon Emissions
      </p>

      <h2 className="text-3xl font-bold text-green-700 mt-1">
        {latestData ? `${latestData.carbon} tCO₂` : "Loading..."}
      </h2>

      <p className="text-green-600 mt-2 font-medium">
        {getCarbonStatus()}
      </p>

    </div>

<div className={darkMode ? "w-15 h-15 rounded-full bg-green-900 flex items-center justify-center" : "w-15 h-15 rounded-full bg-green-100 flex items-center justify-center"}>  <FaLeaf className="text-2xl text-green-600" />
</div>

  </div>

</div>

<div
  className={`rounded-2xl shadow-lg p-6 border-l-4 border-green-600 hover:shadow-2xl transition-all duration-300 ${
    darkMode ? "bg-gray-800" : "bg-white"
  }`}
>
  <div className="flex justify-between items-center">

    <div>

      <p className={darkMode ? "text-gray-300 font-medium" : "text-gray-500 font-medium"}>
        Energy Usage
      </p>

      <h2 className="text-3xl font-bold text-blue-600 mt-1">
        {latestData ? `${latestData.energy} kWh` : "Loading..."}
      </h2>

      <p className="text-blue-600 mt-2 font-medium">
        {getEnergyStatus()}
      </p>

    </div>

    <div className={darkMode ? "w-15 h-15 rounded-full bg-green-900 flex items-center justify-center" : "w-15 h-15 rounded-full bg-green-100 flex items-center justify-center"}>
      <FaBolt className="text-2xl text-blue-600" />
    </div>

  </div>

</div>

  <div
  className={`rounded-2xl shadow-lg p-6 border-l-4 border-green-600 hover:shadow-2xl transition-all duration-300 ${
    darkMode ? "bg-gray-800" : "bg-white"
  }`}
>

  <div className="flex justify-between items-center">

    <div>

      <p className={darkMode ? "text-gray-300 font-medium" : "text-gray-500 font-medium"}>
        Water Consumption
      </p>

      <h2 className="text-3xl font-bold text-cyan-600 mt-1">
        {latestData ? `${latestData.water} L` : "Loading..."}
      </h2>

      <p className="text-cyan-600 mt-2 font-medium">
        {getWaterStatus()}
      </p>

    </div>

    <div className={darkMode ? "w-15 h-15 rounded-full bg-green-900 flex items-center justify-center" : "w-15 h-15 rounded-full bg-green-100 flex items-center justify-center"}>
      <FaTint className="text-2xl text-cyan-600" />
    </div>

  </div>

</div>

  <div
  className={`rounded-2xl shadow-lg p-6 border-l-4 border-green-600 hover:shadow-2xl transition-all duration-300 ${
    darkMode ? "bg-gray-800" : "bg-white"
  }`}
>

  <div className="flex justify-between items-center">

    <div>

      <p className={darkMode ? "text-gray-300 font-medium" : "text-gray-500 font-medium"}>
        ESG Score
      </p>

      <h2 className="text-3xl font-bold text-purple-600 mt-1">
        {calculateESGScore()}/100
      </h2>

      <p className="text-purple-600 mt-2 font-medium">
        {getESGStatus()}
      </p>

    </div>

    <div className={darkMode ? "w-15 h-15 rounded-full bg-green-900 flex items-center justify-center" : "w-15 h-15 rounded-full bg-green-100 flex items-center justify-center"}>
      <FaAward className="text-2xl text-purple-600" />
    </div>

  </div>

</div>
</div>



  {/* Charts */}
  <div className="grid lg:grid-cols-2 gap-6">

  {/* Carbon Emissions Chart */}
            <div
  className={`p-6 rounded-xl shadow transition-all duration-300 ${
    darkMode ? "bg-gray-800" : "bg-white"
  }`}
>
              <div className="flex justify-between items-center mb-5">

  <div>

    <h3
  className={`text-2xl font-bold ${
    darkMode ? "text-white" : "text-gray-800"
  }`}
>
      Environmental Trends
    </h3>

    <p
  className={`text-sm mt-1 ${
    darkMode ? "text-gray-300" : "text-gray-500"
  }`}
>
      Carbon, Energy and Water usage over time
    </p>

  </div>

 <div
  className={`flex items-center gap-2 px-4 py-2 rounded-full border ${
    darkMode
      ? "bg-green-900 border-green-700"
      : "bg-green-50 border-green-300"
  }`}
>

  <span className="relative flex h-2.5 w-2.5">
    <span className="absolute inline-flex h-full w-full rounded-full bg-green-500 animate-ping opacity-75"></span>
    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-600"></span>
  </span>

  <span
  className={`text-sm font-medium ${
    darkMode ? "text-gray-200" : "text-gray-700"
  }`}
>
    Live Data
  </span>

</div>

</div>
<ResponsiveContainer width="100%" height={350}>
                  <LineChart data={chartData}>                 
                  <XAxis
  dataKey="month"
  stroke={darkMode ? "#d1d5db" : "#374151"}
/>

<YAxis
  stroke={darkMode ? "#d1d5db" : "#374151"}
/>

                  <Tooltip
                    content={<CustomTooltip />}
                    cursor={{
                      stroke: "#16a34a",
                      strokeWidth: 2,
                      strokeDasharray: "5 5",
                    }}
                  />

                  <Line
                    type="monotone"
                    dataKey="emissions"
                    stroke="#16a34a"
                    strokeWidth={3}
                  />

                  <Line
                  type="monotone"
                  dataKey="energy"
                  stroke="#2563eb"
                  strokeWidth={3}
                  />

                  <Line
                  type="monotone"
                  dataKey="water"
                  stroke="#06b6d4"
                  strokeWidth={3}
                />
                  </LineChart>
                  
              </ResponsiveContainer>
              <div className="flex justify-center items-center gap-8 mt-5">

  <div className="flex items-center gap-2">
    <div className="w-4 h-1 rounded-full bg-green-600"></div>
    <FaLeaf className="text-green-600 text-sm" />
    <span className="text-sm font-medium text-gray-700">
      Carbon Emissions
    </span>
  </div>

  <div className="flex items-center gap-2">
    <div className="w-4 h-1 rounded-full bg-blue-600"></div>
    <FaBolt className="text-blue-600 text-sm" />
    <span className="text-sm font-medium text-gray-700">
      Energy Usage
    </span>
  </div>

  <div className="flex items-center gap-2">
    <div className="w-4 h-1 rounded-full bg-cyan-500"></div>
    <FaTint className="text-cyan-500 text-sm" />
    <span className="text-sm font-medium text-gray-700">
      Water Consumption
    </span>
  </div>

</div>
</div>

{/* ESG Pie Chart */}
            <div className={`p-6 rounded-xl shadow transition-all duration-300 ${
    darkMode ? "bg-gray-800" : "bg-white"
  }`}
>
              <div className="flex justify-between items-center mb-5">

  <div>

    <h3
  className={`text-2xl font-bold ${
    darkMode ? "text-white" : "text-gray-800"
  }`}
>
      ESG Score Distribution
    </h3>

    <p
  className={`text-sm mt-1 ${
    darkMode ? "text-gray-300" : "text-gray-500"
  }`}
>
      Environmental, Social and Governance performance
    </p>

  </div>

  <div
  className={`flex items-center gap-2 px-4 py-2 rounded-full border ${
    darkMode
      ? "bg-purple-900 border-purple-700"
      : "bg-purple-50 border-purple-300"
  }`}
>

  <span className="relative flex h-2.5 w-2.5">
    <span className="absolute inline-flex h-full w-full rounded-full bg-purple-500 animate-ping opacity-75"></span>
    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-purple-600"></span>
  </span>

  <span className="text-sm font-semibold text-purple-700">
    Updated
  </span>

</div>

</div>


              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={esgData}
                    cx="50%"
                    cy="50%"
                    outerRadius={130}
                    dataKey="value"
                    label
                  >
                    {esgData.map((entry, index) => (
                      <Cell
                        key={index}
                        fill={COLORS[index]}
                      />
                    ))}
                  </Pie>

                  <Tooltip
  contentStyle={{
    backgroundColor: darkMode ? "#1f2937" : "#ffffff",
    border: "none",
    borderRadius: "12px",
    color: darkMode ? "#ffffff" : "#111827",
  }}
/>
                </PieChart>
              </ResponsiveContainer>
              
            </div>
          </div>

          {/* recent environmental activity */}
          <div
  className={`p-6 rounded-xl shadow mt-8 transition-all duration-300 ${
    darkMode ? "bg-gray-800" : "bg-white"
  }`}
>
  <div className="flex justify-between items-center mb-4">

  <h3
  className={`text-xl font-semibold ${
    darkMode ? "text-white" : "text-gray-900"
  }`}
>
    Recent Environmental Activity
  </h3>

  <button
    onClick={() => navigate("/environmental")}
    className="text-green-600 hover:text-green-700 font-medium text-sm hover:underline transition">
    View All →
  </button>

</div>

<div className="space-y-3 max-h-[550px] overflow-y-auto pr-2">
    {chartData
      .slice()
      .reverse()
      .slice(0, 4)
      .map((item, index) => (
        <div
  key={index}
  className={`transition-all duration-300 rounded-2xl border p-4 shadow-sm hover:shadow-md ${
  darkMode
    ? "bg-gray-700 hover:bg-gray-600 border-gray-600"
    : "bg-gray-50 hover:bg-green-50 border-gray-200"
}`}
>
  <div className="flex justify-between items-center">

    {/* Date */}
    <div className={`flex items-center gap-2 font-semibold ${
  darkMode ? "text-white" : "text-gray-700"
}`}>
      <FaCalendarAlt className="text-gray-500" />
      <span>{item.month}</span>
    </div>

    <span className={`text-xs px-3 py-1 rounded-full font-medium ${
  darkMode
    ? "bg-green-900 text-green-300"
    : "bg-green-100 text-green-700"
}`}>
      Latest Update
    </span>

  </div>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-5">

    {/* Carbon */}
    <div className="flex items-start gap-3">

      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
  darkMode ? "bg-green-900" : "bg-green-100"
}`}>
        <FaLeaf className="text-green-600" />
      </div>

      <div>
        <p className={`text-sm ${
  darkMode ? "text-gray-300" : "text-gray-500"
}`}>
          Carbon Emissions
        </p>

        <p className={`text-lg font-bold ${
  darkMode ? "text-green-300" : "text-green-700"
}`}>
          {item.emissions} tCO₂
        </p>
      </div>

    </div>

    {/* Energy */}
    <div className="flex items-start gap-3">

      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
  darkMode ? "bg-blue-900" : "bg-blue-100"
}`}>
        <FaBolt className="text-blue-600" />
      </div>

      <div>
        <p className={`text-sm ${
  darkMode ? "text-gray-300" : "text-gray-500"
}`}>
          Energy Usage
        </p>

        <p className={`text-lg font-bold ${
  darkMode ? "text-blue-300" : "text-blue-700"
}`}>
          {item.energy} kWh
        </p>
      </div>

    </div>

    {/* Water */}
    <div className="flex items-start gap-3">

      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
  darkMode ? "bg-cyan-900" : "bg-cyan-100"
}`}>
        <FaTint className="text-cyan-600" />
      </div>

      <div>
        <p className={`text-sm ${
  darkMode ? "text-gray-300" : "text-gray-500"
}`}>
          Water Consumption
        </p>

        <p className={`text-lg font-bold ${
  darkMode ? "text-cyan-300" : "text-cyan-700"
}`}>
          {item.water} L
        </p>
      </div>

    </div>

  </div>
</div>

      ))}
  </div>
</div>
{/* AI insights */}
<div
  className={`p-6 rounded-2xl shadow-lg mt-8 transition-all duration-300 ${
    darkMode ? "bg-gray-800" : "bg-white"
  }`}
>

  {/* Header */}
  <div className="flex justify-between items-center mb-6">

    <div>

      <h3
  className={`text-2xl font-bold flex items-center gap-3 ${
    darkMode ? "text-white" : "text-gray-800"
  }`}
>
        <FaRobot className="text-green-600" />
        AI ESG Insights
      </h3>

      <p
  className={`text-sm mt-1 ${
    darkMode ? "text-gray-300" : "text-gray-500"
  }`}
>
        Smart recommendations based on your latest ESG data.
      </p>

    </div>
    <div
  className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-300 ${
    darkMode
      ? "bg-green-900 border-green-700"
      : "bg-green-50 border-green-300"
  }`}
>

  <span className="relative flex h-2.5 w-2.5">
    <span className="absolute inline-flex h-full w-full rounded-full bg-green-500 animate-ping opacity-75"></span>
    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-600"></span>
  </span>

  <span
  className={`text-sm font-semibold ${
    darkMode ? "text-green-300" : "text-green-700"
  }`}
>
    AI Analysis
  </span>


</div>
    </div>

  <div className="space-y-4">

    {getAIInsights().map((insight, index) => {

      let Icon = FaInfoCircle;
      let bg = "bg-blue-50";
      let border = "border-blue-500";

      if (insight.includes("✅") || insight.includes("🏆")) {
        Icon = FaCheckCircle;
        bg = "bg-green-50";
        border = "border-green-500";
      }

      if (insight.includes("⚠")) {
        Icon = FaExclamationTriangle;
        bg = "bg-red-50";
        border = "border-red-500";
      }

      return (

        <div
          key={index}
          className={`border-l-4 ${border} rounded-xl p-4 flex items-start gap-4 transition-all duration-300 ${
  darkMode
    ? `${
        bg === "bg-green-50"
          ? "bg-green-950"
          : bg === "bg-red-50"
          ? "bg-red-950"
          : "bg-blue-950"
      }`
    : bg
}`}
        >

          <Icon
  className={`mt-1 text-xl ${
    darkMode ? "text-white" : "text-gray-700"
  }`}
/>

          <p
  className={`font-medium ${
    darkMode ? "text-gray-200" : "text-gray-700"
  }`}
>
            {insight.replace(/[⚠✅🏆🟡⚡💧]/g, "")}
          </p>

        </div>

      );

    })}

  </div>

</div>

   <AIChatbot
  latestData={latestData}
  esgScore={calculateESGScore()}
  darkMode={darkMode}
/>
        </div>
          </div>

  </MainLayout>
);
}
const getTimeAgo = (date) => {
  if (!date) return "Just now";

  const notificationDate =
    date.seconds
      ? new Date(date.seconds * 1000)
      : new Date(date);

  const seconds = Math.floor((new Date() - notificationDate) / 1000);

  if (seconds < 60) return "Just now";

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60)
    return `${minutes} min${minutes > 1 ? "s" : ""} ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24)
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;

  const days = Math.floor(hours / 24);

  if (days === 1) return "Yesterday";

  return `${days} days ago`;
};

const getNotifications = () => {
  if (!latestData) {
    return [
      {
        type: "info",
        message: "Loading latest environmental data...",
      },
    ];
  }
  return notifications;
};
export default Dashboard;