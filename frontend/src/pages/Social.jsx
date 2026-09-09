import { useState, useEffect, useRef } from "react";
import Sidebar from "../components/Sidebar";
import toast from "react-hot-toast";
import { useTheme } from "../context/ThemeContext";

import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  query,
  orderBy,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";

import { db } from "../config/firebase";

import {
  Users,
  GraduationCap,
  ShieldAlert,
  HeartHandshake,
  Pencil,
  Trash2,
} from "lucide-react";

import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function Social() {
  const { darkMode } = useTheme();
  const [totalEmployees, setTotalEmployees] = useState("");
  const [maleEmployees, setMaleEmployees] = useState("");
  const [femaleEmployees, setFemaleEmployees] = useState("");
  const [otherEmployees, setOtherEmployees] = useState("");

  const [employeesTrained, setEmployeesTrained] = useState("");
  const [trainingHours, setTrainingHours] = useState("");

  const [safetyIncidents, setSafetyIncidents] = useState("");
  const [csrActivities, setCsrActivities] = useState("");

  const [records, setRecords] = useState([]);

  const [validationError, setValidationError] = useState("");
  const [trainingError, setTrainingError] = useState("");
  const [trainedError, setTrainedError] = useState("");
  const [safetyError, setSafetyError] = useState("");
  const [csrError, setCsrError] = useState("");

  const [editId, setEditId] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);

  const formRef = useRef(null);
  const latestRecord = records.length > 0 ? records[0] : null;
  const trainingChartData = [...records]
  .reverse()
  .map((record, index) => ({
    month: record.createdAt?.toDate
      ? record.createdAt.toDate().toLocaleDateString("en-US", {
          month: "short",
        })
      : `Record ${index + 1}`,

    hours: record.trainingHours || 0,
  }));

const safetyChartData = [...records]
  .reverse()
  .map((record, index) => ({
    month: record.createdAt?.toDate
      ? record.createdAt.toDate().toLocaleDateString("en-US", {
          month: "short",
        })
      : `Record ${index + 1}`,

    incidents: record.safetyIncidents || 0,
  }));

  const csrChartData = [...records]
  .reverse()
  .map((record, index) => ({
    month: record.createdAt?.toDate
      ? record.createdAt.toDate().toLocaleDateString("en-US", {
          month: "short",
        })
      : `Record ${index + 1}`,

    activities: record.csrActivities || 0,
  }));

const totalEmployeesValue =
  latestRecord?.totalEmployees || 0;

const trainingHoursValue =
  latestRecord?.trainingHours || 0;

const safetyIncidentsValue =
  latestRecord?.safetyIncidents || 0;

const csrActivitiesValue =
  latestRecord?.csrActivities || 0;

const malePercentage =
  latestRecord?.totalEmployees
    ? Math.round(
        (latestRecord.maleEmployees /
          latestRecord.totalEmployees) *
          100
      )
    : 0;

const femalePercentage =
  latestRecord?.totalEmployees
    ? Math.round(
        (latestRecord.femaleEmployees /
          latestRecord.totalEmployees) *
          100
      )
    : 0;

const otherPercentage =
  latestRecord?.totalEmployees
    ? Math.max(
        0,
        100 - malePercentage - femalePercentage
      )
    : 0;

const employeesTrainedValue =
  latestRecord?.employeesTrained || 0;

const averageTrainingHours =
  employeesTrainedValue > 0
    ? (
        trainingHoursValue /
        employeesTrainedValue
      ).toFixed(2)
    : "0.00";

const largestWorkforcePercentage = Math.max(
  malePercentage,
  femalePercentage,
  otherPercentage
);

const diversityScore =
  latestRecord?.totalEmployees > 0
    ? Math.max(
        0,
        Math.min(
          25,
          Math.round(
            ((1 - largestWorkforcePercentage / 100) / (2 / 3)) * 25
          )
        )
      )
    : 0;

const trainingScore =
  latestRecord
    ? Math.min(
        25,
        Math.round(
          (averageTrainingHours / 5) * 25
        )
      )
    : 0;

const safetyScore =
  latestRecord
    ? Math.max(
        0,
        25 - safetyIncidentsValue * 5
      )
    : 0;

const csrScore =
  latestRecord
    ? Math.min(
        25,
        csrActivitiesValue * 2
      )
    : 0;

const socialScore =
  diversityScore +
  trainingScore +
  safetyScore +
  csrScore;

  const fetchRecords = async () => {
  try {
    const q = query(
      collection(db, "socialData"),
      orderBy("createdAt", "desc")
    );

    const snapshot = await getDocs(q);

    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setRecords(data);
  } catch (error) {
    console.error("Error fetching social records:", error);
    toast.error("Failed to load social records.");
  }
};

const handleSubmit = async (e) => {
  e.preventDefault();

  setValidationError("");
  setTrainingError("");
  setTrainedError("");
  setSafetyError("");
  setCsrError("");

if (
  !totalEmployees ||
  !maleEmployees ||
  !femaleEmployees ||
  !otherEmployees ||
  !employeesTrained ||
  !trainingHours ||
  !safetyIncidents ||
  !csrActivities
) {

  setValidationError("Please fill in all required fields.");
  return;
}

const total = Number(totalEmployees);
const male = Number(maleEmployees);
const female = Number(femaleEmployees);
const other = Number(otherEmployees);
const trained = Number(employeesTrained);
const hours = Number(trainingHours);
const safety = Number(safetyIncidents);
const csr = Number(csrActivities);

// ================= VALIDATION =================

let hasValidationError = false;


// ================= WORKFORCE VALIDATION =================

if (male + female + other !== total) {

  const calculatedEmployees = male + female + other;

  setValidationError(
    `You entered ${calculatedEmployees} employees across the workforce categories, but Total Employees is ${total}. Please review the workforce numbers.`
  );

  hasValidationError = true;
}


// ================= TRAINING VALIDATION =================

if (trained > total) {
  setTrainedError(
    "Employees trained cannot exceed Total Employees."
  );

  hasValidationError = true;
}


// ================= NEGATIVE VALUE VALIDATION =================

if (
  total < 0 ||
  male < 0 ||
  female < 0 ||
  other < 0
) {

  setValidationError(
    "Employee values cannot be negative."
  );

  hasValidationError = true;
}

if (trained < 0 || hours < 0) {
  setTrainingError(
    "Training values cannot be negative."
  );

  hasValidationError = true;
}

if (safety < 0) {
  setSafetyError(
    "Safety incidents cannot be negative."
  );

  hasValidationError = true;
}

if (csr < 0) {
  setCsrError(
    "CSR activities cannot be negative."
  );

  hasValidationError = true;
}


// ================= WHOLE NUMBER VALIDATION =================

if (
  !Number.isInteger(total) ||
  !Number.isInteger(male) ||
  !Number.isInteger(female) ||
  !Number.isInteger(other) ||
  !Number.isInteger(trained)
) {

  setValidationError(
    "Employee values must be whole numbers."
  );

  hasValidationError = true;
}


// ================= STOP IF ANY ERROR EXISTS =================

if (hasValidationError) {
  return;
}

  try {
  const socialData = {
    totalEmployees: Number(totalEmployees),
    maleEmployees: Number(maleEmployees),
    femaleEmployees: Number(femaleEmployees),
    otherEmployees: Number(otherEmployees),
    employeesTrained: Number(employeesTrained),
    trainingHours: Number(trainingHours),
    safetyIncidents: Number(safetyIncidents),
    csrActivities: Number(csrActivities),
  };

    if (editId) {
      // UPDATE EXISTING RECORD

      await updateDoc(
        doc(db, "socialData", editId),
        socialData
      );

      toast.success("Social record updated successfully!");
    } else {
      // CREATE NEW RECORD

      await addDoc(
        collection(db, "socialData"),
        {
          ...socialData,
          createdAt: serverTimestamp(),
        }
      );

      toast.success("Social record saved successfully!");
    }

    // Clear form

    setMaleEmployees("");
    setFemaleEmployees("");
    setOtherEmployees("");
    setEmployeesTrained("");
    setEmployeesTrained("");
    setTrainingHours("");
    setSafetyIncidents("");
    setCsrActivities("");

    // Exit edit mode

    setEditId(null);

    // Refresh records

    fetchRecords();

  } catch (error) {
    console.error("Error saving social record:", error);

    toast.error(
      editId
        ? "Failed to update social record."
        : "Failed to save social record."
    );
  }
};

const handleEdit = (record) => {
  setTotalEmployees(record.totalEmployees);
  setMaleEmployees(record.maleEmployees);
  setFemaleEmployees(record.femaleEmployees);

  setEmployeesTrained(record.employeesTrained);
  setTrainingHours(record.trainingHours);

  setSafetyIncidents(record.safetyIncidents);
  setCsrActivities(record.csrActivities);

  setEditId(record.id);

  setTimeout(() => {
    formRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, 100);
};

const handleDelete = async () => {
  if (!recordToDelete) return;

  try {
    await deleteDoc(
      doc(db, "socialData", recordToDelete.id)
    );

    toast.success("Social record deleted successfully!");

    setShowDeleteModal(false);
    setRecordToDelete(null);

    fetchRecords();

  } catch (error) {
    console.error("Error deleting social record:", error);

    toast.error("Failed to delete social record.");
  }
};

useEffect(() => {
  let isMounted = true;
  const loadData = async () => {
    try {
      const q = query(
        collection(db, "socialData"),
        orderBy("createdAt", "desc")
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      if (isMounted) {
        setRecords(data);
      }
    } catch (error) {
      console.error("Error fetching social records:", error);
    }
  };
  loadData();
  return () => {
    isMounted = false;
  };
}, []);

  return (
    <div className={`flex min-h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>

      {/* ================= SIDEBAR ================= */}

      <Sidebar />

      {/* ================= MAIN CONTENT ================= */}

      <div className="flex-1 ml-64">

     {/* HEADER */}

<div className={`fixed top-0 left-0 md:left-64 right-0 border-b z-40 ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>

  <div className="px-4 md:px-10 py-4 md:py-6 flex justify-between items-center">

    <div className="pl-12 md:pl-0">

      <h1 className={`text-2xl md:text-4xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
        Social Management
      </h1>

      <p className={`mt-1 text-xs md:text-lg hidden sm:block ${darkMode ? "text-gray-300" : "text-gray-500"}`}>
        Manage workforce, training, safety and community impact.
      </p>

    </div>

    <div className="flex items-center">

      {/* Live System */}

     <div className="hidden md:flex items-center gap-3 bg-green-50 border border-green-300 px-5 py-2 rounded-full shadow-lg shadow-green-200/60">

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


        {/* ================= PAGE CONTENT ================= */}

        <div className="p-4 md:p-10 pt-28 md:pt-40 space-y-6 md:space-y-8">


          {/* ===================================================== */}
          {/*                    KPI CARDS                           */}
          {/* ===================================================== */}

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">


            {/* TOTAL EMPLOYEES */}

            <div className={`rounded-2xl border p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>

              <div className="flex items-center justify-between">

                <div>

                  <p className={`text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                    Total Employees
                  </p>

                  <h2 className={`text-3xl font-bold mt-2 ${darkMode ? "text-white" : "text-gray-900"}`}>
                   {totalEmployeesValue}
                  </h2>

                  <p className={`text-sm mt-2 ${darkMode ? "text-gray-400" : "text-gray-400"}`}>
                    Employees
                  </p>

                </div>

                <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${darkMode ? "bg-blue-900/60" : "bg-blue-100"}`}>

                  <Users
                    size={28}
                    className={darkMode ? "text-blue-300" : "text-blue-600"}
                  />

                </div>

              </div>

            </div>


            {/* TRAINING HOURS */}

            <div className={`rounded-2xl border p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>

              <div className="flex items-center justify-between">

                <div>

                  <p className={`text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                    Training Hours
                  </p>

                  <h2 className={`text-3xl font-bold mt-2 ${darkMode ? "text-white" : "text-gray-900"}`}>
                    {trainingHoursValue}
                  </h2>

                  <p className={`text-sm mt-2 ${darkMode ? "text-gray-400" : "text-gray-400"}`}>
                    Total Hours
                  </p>

                </div>

                <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${darkMode ? "bg-purple-900/60" : "bg-purple-100"}`}>

                  <GraduationCap
                    size={28}
                    className={darkMode ? "text-purple-300" : "text-purple-600"}
                  />

                </div>

              </div>

            </div>


            {/* SAFETY INCIDENTS */}

            <div className={`rounded-2xl border p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>

              <div className="flex items-center justify-between">

                <div>

                  <p className={`text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                    Safety Incidents
                  </p>

                  <h2 className={`text-3xl font-bold mt-2 ${darkMode ? "text-white" : "text-gray-900"}`}>
                    {safetyIncidentsValue}
                  </h2>

                  <p className={`text-sm mt-2 ${darkMode ? "text-gray-400" : "text-gray-400"}`}>
                    Reported Incidents
                  </p>

                </div>

                <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${darkMode ? "bg-red-900/60" : "bg-red-100"}`}>

                  <ShieldAlert
                    size={28}
                    className={darkMode ? "text-red-300" : "text-red-600"}
                  />

                </div>

              </div>

            </div>


            {/* CSR ACTIVITIES */}

            <div className={`rounded-2xl border p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>

              <div className="flex items-center justify-between">

                <div>

                  <p className={`text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                    CSR Activities
                  </p>

                  <h2 className={`text-3xl font-bold mt-2 ${darkMode ? "text-white" : "text-gray-900"}`}>
                    {csrActivitiesValue}
                  </h2>

                  <p className={`text-sm mt-2 ${darkMode ? "text-gray-400" : "text-gray-400"}`}>
                    Community Activities
                  </p>

                </div>

                <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${darkMode ? "bg-green-900/60" : "bg-green-100"}`}>

                  <HeartHandshake
                    size={28}
                    className={darkMode ? "text-green-300" : "text-green-600"}
                  />

                </div>

              </div>

            </div>

          </div>


          {/* ===================================================== */}
          {/*          WORKFORCE + TRAINING OVERVIEW                */}
          {/* ===================================================== */}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">


            {/* WORKFORCE DIVERSITY */}

            <div className={`rounded-2xl border p-7 shadow-sm ${darkMode ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-200 text-gray-900"}`}>

              <div className="flex items-center justify-between mb-7">

                <div>

                  <h2 className={`text-xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>
                    Workforce Diversity
                  </h2>

                  <p className={`text-sm mt-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                    Employee gender distribution
                  </p>

                </div>

                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${darkMode ? "bg-blue-900/60" : "bg-blue-100"}`}>

                  <Users
                    size={24}
                    className={darkMode ? "text-blue-300" : "text-blue-600"}
                  />

                </div>

              </div>


              {/* Male */}

              <div className="mb-6">

                <div className="flex justify-between mb-2">

                  <span className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                    Male
                  </span>

                  <span className={`text-sm font-semibold ${darkMode ? "text-white" : "text-gray-800"}`}>
                    {malePercentage}%
                  </span>

                </div>

                <div className={`w-full h-3 rounded-full ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>

                  <div
                    className="h-3 bg-blue-500 rounded-full"
                    style={{ width: `${malePercentage}%` }}
                  ></div>

                </div>

              </div>


              {/* Female */}

              <div className="mb-6">

                <div className="flex justify-between mb-2">

                  <span className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                    Female
                  </span>

                  <span className={`text-sm font-semibold ${darkMode ? "text-white" : "text-gray-800"}`}>
                    {femalePercentage}%
                  </span>

                </div>

                <div className={`w-full h-3 rounded-full ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>

                  <div
                    className="h-3 bg-pink-500 rounded-full"
                    style={{ width: `${femalePercentage}%` }}
                  ></div>

                </div>

              </div>


              {/* Other */}

              <div>

                <div className="flex justify-between mb-2">

                  <span className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                    Other / Not Disclosed
                  </span>

                  <span className={`text-sm font-semibold ${darkMode ? "text-white" : "text-gray-800"}`}>
                   {otherPercentage}%
                  </span>

                </div>

                <div className={`w-full h-3 rounded-full ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>

                  <div
                    className="h-3 bg-purple-500 rounded-full"
                    style={{ width: `${otherPercentage}%` }}
                  ></div>

                </div>

              </div>

            </div>


            {/* TRAINING PERFORMANCE */}

            <div className={`rounded-2xl border p-7 shadow-sm ${darkMode ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-200 text-gray-900"}`}>

              <div className="flex items-center justify-between mb-7">

                <div>

                  <h2 className={`text-xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>
                    Training Performance
                  </h2>

                  <p className={`text-sm mt-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                    Employee learning and development
                  </p>

                </div>

                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${darkMode ? "bg-purple-900/60" : "bg-purple-100"}`}>

                  <GraduationCap
                    size={24}
                    className={darkMode ? "text-purple-300" : "text-purple-600"}
                  />

                </div>

              </div>


              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">

                {/* Employees Trained */}

                <div className={`rounded-xl p-5 border ${darkMode ? "bg-purple-950/40 border-purple-900/50" : "bg-purple-50 border-transparent"}`}>

                  <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                    Employees Trained
                  </p>

                  <p className={`text-3xl font-bold mt-2 ${darkMode ? "text-purple-300" : "text-purple-700"}`}>
                    {employeesTrainedValue}
                  </p>

                  <p className={`text-xs mt-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                    Employees
                  </p>

                </div>


                {/* Training Hours */}

                <div className={`rounded-xl p-5 border ${darkMode ? "bg-blue-950/40 border-blue-900/50" : "bg-blue-50 border-transparent"}`}>

                  <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                    Training Hours
                  </p>

                  <p className={`text-3xl font-bold mt-2 ${darkMode ? "text-blue-300" : "text-blue-700"}`}>
                      {trainingHoursValue}
                  </p>

                  <p className={`text-xs mt-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                    Total Hours
                  </p>

                </div>

              </div>


              {/* Average Training */}

              <div className={`mt-5 rounded-xl p-5 ${darkMode ? "bg-gray-700/50" : "bg-gray-50"}`}>

                <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                  Average Training Hours
                </p>

                <div className="flex items-end gap-2 mt-1">

                  <p className={`text-3xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>
                    {averageTrainingHours}
                  </p>

                  <span className={`text-sm mb-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                    hours / employee
                  </span>

                </div>

              </div>

            </div>

          </div>

          {/* ===================================================== */}
          {/*                SOCIAL PERFORMANCE SCORE               */}
          {/* ===================================================== */}

          <div className={`rounded-2xl border shadow-sm mt-8 p-8 ${darkMode ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-200 text-gray-900"}`}>

            <div className="flex flex-col md:flex-row items-center justify-between gap-8">

              {/* Score Information */}

              <div>

                <p className="text-sm font-semibold text-green-600 dark:text-green-400 uppercase tracking-wide">
                  ESG Social Performance
                </p>

                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mt-2">
                  Social Performance Score
                </h2>

                <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-xl">
                  Overall social sustainability performance based on
                  workforce diversity, employee training, safety and
                  community engagement.
                </p>

              </div>


              {/* Score */}

              <div className="flex items-center gap-6">

                <div className="w-32 h-32 rounded-full bg-green-50 dark:bg-green-950/40 border-8 border-green-500 flex flex-col items-center justify-center">

                  <span className="text-4xl font-bold text-green-700 dark:text-green-300">
                    {socialScore}
                  </span>

                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    / 100
                  </span>

                </div>


                <div>

                  <p className="text-lg font-bold text-gray-800 dark:text-white">
                    {socialScore >= 80
                      ? "Excellent Performance"
                      : socialScore >= 60
                      ? "Good Performance"
                      : socialScore >= 40
                      ? "Needs Improvement"
                      : "Poor Performance"}
                  </p>

                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Based on current social metrics
                  </p>

                </div>

              </div>

            </div>


            {/* Score Breakdown */}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-gray-100 dark:border-gray-700">

              {/* Diversity */}

              <div className="bg-blue-50 dark:bg-blue-950/40 rounded-xl p-4 border border-transparent dark:border-blue-900/50">

                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Diversity
                </p>

                <p className="text-xl font-bold text-blue-700 dark:text-blue-300 mt-1">
                  {diversityScore}/25
                </p>

              </div>


              {/* Training */}

              <div className="bg-purple-50 dark:bg-purple-950/40 rounded-xl p-4 border border-transparent dark:border-purple-900/50">

                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Training
                </p>

                <p className="text-xl font-bold text-purple-700 dark:text-purple-300 mt-1">
                  {trainingScore}/25
                </p>

              </div>


              {/* Safety */}

              <div className="bg-red-50 dark:bg-red-950/40 rounded-xl p-4 border border-transparent dark:border-red-900/50">

                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Safety
                </p>

                <p className="text-xl font-bold text-red-700 dark:text-red-300 mt-1">
                  {safetyScore}/25
                </p>

              </div>


              {/* CSR */}

              <div className="bg-green-50 dark:bg-green-950/40 rounded-xl p-4 border border-transparent dark:border-green-900/50">

                <p className="text-sm text-gray-500 dark:text-gray-400">
                  CSR
                </p>

                <p className="text-xl font-bold text-green-700 dark:text-green-300 mt-1">
                  {csrScore}/25
                </p>

              </div>

            </div>

          </div>

          {/* ===================================================== */}
          {/*                 TRAINING HOURS TREND                  */}
          {/* ===================================================== */}

          <div className={`rounded-2xl border shadow-sm mt-8 p-8 ${darkMode ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-200 text-gray-900"}`}>

            {/* Chart Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                  Training Hours Trend
                </h2>
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                  Employee training hours over recorded periods.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-purple-500/10 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300 border border-purple-500/30">
                  Total: {trainingChartData.reduce((acc, curr) => acc + (curr.hours || 0), 0)} Hours
                </span>
                <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/60 flex items-center justify-center">
                  <GraduationCap
                    size={22}
                    className="text-purple-600 dark:text-purple-300"
                  />
                </div>
              </div>
            </div>

            {/* Chart */}
            <div className="w-full h-80">
              {trainingChartData.length === 0 ? (
                <div className="h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
                  No training data available yet.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={trainingChartData}
                    margin={{
                      top: 10,
                      right: 20,
                      left: 0,
                      bottom: 10,
                    }}
                  >
                    <defs>
                      <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#a855f7" stopOpacity={0.5} />
                        <stop offset="95%" stopColor="#a855f7" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>

                    <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#374151" : "#e5e7eb"} strokeOpacity={0.5} />

                    <XAxis
                      dataKey="month"
                      stroke={darkMode ? "#d1d5db" : "#4b5563"}
                      tick={{ fill: darkMode ? "#d1d5db" : "#4b5563", fontSize: 12, fontWeight: 600 }}
                    />

                    <YAxis
                      stroke={darkMode ? "#d1d5db" : "#4b5563"}
                      tick={{ fill: darkMode ? "#d1d5db" : "#4b5563", fontSize: 12, fontWeight: 600 }}
                    />

                    <Tooltip
                      contentStyle={{
                        backgroundColor: darkMode ? "#111827" : "#ffffff",
                        borderColor: darkMode ? "#8b5cf6" : "#a855f7",
                        borderRadius: "0.75rem",
                        color: darkMode ? "#ffffff" : "#111827",
                        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.4)",
                        fontWeight: 600,
                      }}
                    />

                    <Area
                      type="monotone"
                      dataKey="hours"
                      stroke="#a855f7"
                      strokeWidth={3.5}
                      fillOpacity={1}
                      fill="url(#purpleGradient)"
                      dot={{ r: 5, fill: "#a855f7", stroke: darkMode ? "#111827" : "#ffffff", strokeWidth: 2 }}
                      activeDot={{ r: 7, fill: "#c084fc" }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
          
      {/* ===================================================== */}
      {/*              SAFETY + CSR ANALYTICS                  */}
      {/* ===================================================== */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">

        {/* ===================================================== */}
        {/*                 SAFETY INCIDENTS TREND                */}
        {/* ===================================================== */}

        <div className={`rounded-2xl border shadow-sm p-6 ${darkMode ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-200 text-gray-900"}`}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                Safety Incidents Trend
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Reported workplace safety incidents over recorded periods.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/30">
                {safetyChartData.reduce((acc, curr) => acc + (curr.incidents || 0), 0)} Total
              </span>
              <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/60 flex items-center justify-center">
                <ShieldAlert
                  size={20}
                  className="text-red-600 dark:text-red-300"
                />
              </div>
            </div>
          </div>

          <div className="w-full h-72">
            {safetyChartData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
                No safety data available yet.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={safetyChartData}
                  barSize={36}
                  margin={{
                    top: 10,
                    right: 10,
                    left: -10,
                    bottom: 10,
                  }}
                >
                  <defs>
                    <linearGradient id="safetyRedGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f87171" stopOpacity={1} />
                      <stop offset="100%" stopColor="#dc2626" stopOpacity={0.85} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#374151" : "#e5e7eb"} strokeOpacity={0.5} />

                  <XAxis
                    dataKey="month"
                    stroke={darkMode ? "#d1d5db" : "#4b5563"}
                    tick={{ fill: darkMode ? "#d1d5db" : "#4b5563", fontSize: 12, fontWeight: 600 }}
                  />

                  <YAxis
                    allowDecimals={false}
                    stroke={darkMode ? "#d1d5db" : "#4b5563"}
                    tick={{ fill: darkMode ? "#d1d5db" : "#4b5563", fontSize: 12, fontWeight: 600 }}
                  />

                  <Tooltip
                    contentStyle={{
                      backgroundColor: darkMode ? "#111827" : "#ffffff",
                      borderColor: darkMode ? "#ef4444" : "#dc2626",
                      borderRadius: "0.75rem",
                      color: darkMode ? "#ffffff" : "#111827",
                      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.4)",
                      fontWeight: 600,
                    }}
                  />

                  <Bar
                    dataKey="incidents"
                    fill="url(#safetyRedGrad)"
                    radius={[10, 10, 3, 3]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* ===================================================== */}
        {/*                  CSR ACTIVITY TREND                  */}
        {/* ===================================================== */}

        <div className={`rounded-2xl border shadow-sm p-6 ${darkMode ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-200 text-gray-900"}`}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                CSR Activity Trend
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Community and social responsibility activities over recorded periods.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                {csrChartData.reduce((acc, curr) => acc + (curr.activities || 0), 0)} Total
              </span>
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 flex items-center justify-center">
                <HeartHandshake
                  size={20}
                  className="text-emerald-600 dark:text-emerald-300"
                />
              </div>
            </div>
          </div>

          <div className="w-full h-72">
            {csrChartData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
                No CSR data available yet.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={csrChartData}
                  barSize={36}
                  margin={{
                    top: 10,
                    right: 10,
                    left: -10,
                    bottom: 10,
                  }}
                >
                  <defs>
                    <linearGradient id="csrGreenGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#34d399" stopOpacity={1} />
                      <stop offset="100%" stopColor="#059669" stopOpacity={0.85} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#374151" : "#e5e7eb"} strokeOpacity={0.5} />

                  <XAxis
                    dataKey="month"
                    stroke={darkMode ? "#d1d5db" : "#4b5563"}
                    tick={{ fill: darkMode ? "#d1d5db" : "#4b5563", fontSize: 12, fontWeight: 600 }}
                  />

                  <YAxis
                    allowDecimals={false}
                    stroke={darkMode ? "#d1d5db" : "#4b5563"}
                    tick={{ fill: darkMode ? "#d1d5db" : "#4b5563", fontSize: 12, fontWeight: 600 }}
                  />

                  <Tooltip
                    contentStyle={{
                      backgroundColor: darkMode ? "#111827" : "#ffffff",
                      borderColor: darkMode ? "#10b981" : "#059669",
                      borderRadius: "0.75rem",
                      color: darkMode ? "#ffffff" : "#111827",
                      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.4)",
                      fontWeight: 600,
                    }}
                  />

                  <Bar
                    dataKey="activities"
                    fill="url(#csrGreenGrad)"
                    radius={[10, 10, 3, 3]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

      </div>

          {/* ===================================================== */}
          {/*                    ADD SOCIAL RECORD                   */}
          {/* ===================================================== */}

          <form
  ref={formRef}
  onSubmit={handleSubmit}
  className={`rounded-2xl border shadow-sm p-8 mt-8 ${darkMode ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-200 text-gray-900"}`}
>


            {/* FORM HEADER */}

            <div className="flex items-center justify-between mb-8">

              <div>

                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                  Add Social Record
                </h2>

                <p className="text-gray-500 dark:text-gray-400 mt-1">
                  Enter the latest social sustainability data.
                </p>

              </div>

              <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/60 flex items-center justify-center">

                <Users
                  size={24}
                  className="text-green-600 dark:text-green-300"
                />

              </div>

            </div>


            {/* ================= WORKFORCE ================= */}

            <div className="mb-8">

              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                Workforce
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

                <div>

                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Total Employees
                  </label>

                  <input
                    type="number"
                    placeholder="Enter total employees"
                    value={totalEmployees}
                    onChange={(e) => setTotalEmployees(e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border outline-none focus:ring-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-white ${
                    validationError
                      ? "border-red-400 focus:ring-red-500"
                      : "border-gray-300 dark:border-gray-700 focus:ring-green-500"
                    }`}
                  />

                </div>


                <div>

                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Male Employees
                  </label>

                  <input
                    type="number"
                    placeholder="Enter male employees"
                    value={maleEmployees}
                    onChange={(e) => setMaleEmployees(e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border outline-none focus:ring-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-white ${
                    validationError
                      ? "border-red-400 focus:ring-red-500"
                      : "border-gray-300 dark:border-gray-700 focus:ring-green-500"
                    }`}
                  />

                </div>


                <div>

                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Female Employees
                  </label>

                  <input
                    type="number"
                    placeholder="Enter female employees"
                    value={femaleEmployees}
                    onChange={(e) => setFemaleEmployees(e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border outline-none focus:ring-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-white ${
                      validationError
                        ? "border-red-400 focus:ring-red-500"
                        : "border-gray-300 dark:border-gray-700 focus:ring-green-500"
                    }`}
                  />

                </div>

              </div>

            </div>
            <div>

                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Other / Not Disclosed
                </label>

                <input
                  type="number"
                  min="0"
                  placeholder="Enter other employees"
                  value={otherEmployees}
                  onChange={(e) => setOtherEmployees(e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border outline-none focus:ring-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-white ${
                    validationError
                      ? "border-red-400 focus:ring-red-500"
                      : "border-gray-300 dark:border-gray-700 focus:ring-green-500"
                  }`}
                />

              </div>

{validationError && (
  <div className="mt-5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 rounded-xl px-5 py-4">

    <div className="flex items-start gap-3">

      <div className="mt-0.5 text-red-600 dark:text-red-400 text-lg">
        ⚠
      </div>

      <div>

        <p className="text-sm font-semibold text-red-800 dark:text-red-300">
          Workforce Data Needs Correction
        </p>

        <p className="text-sm text-red-600 dark:text-red-400 mt-1 leading-6">
          {validationError}
        </p>

      </div>

    </div>

  </div>
)}

            {/* ================= TRAINING ================= */}

            <div className="mb-8">

              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                Employee Training
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                <div>

                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Employees Trained
                  </label>

                  <input
                    type="number"
                    placeholder="Enter employees trained"
                    value={employeesTrained}
                    onChange={(e) => setEmployeesTrained(e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border outline-none focus:ring-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-white ${
                    trainedError
                      ? "border-red-400 focus:ring-red-500"
                      : "border-gray-300 dark:border-gray-700 focus:ring-purple-500"
                    }`}
                  />

                    {trainedError && (
                      <p className="text-sm text-red-600 dark:text-red-400 mt-2">
                        ⚠ {trainedError}
                      </p>
                    )}

                </div>

                <div>

                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Training Hours
                  </label>

                  <input
                    type="number"
                    placeholder="Enter total training hours"
                    value={trainingHours}
                    onChange={(e) => setTrainingHours(e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border outline-none focus:ring-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-white ${
                    trainingError
                      ? "border-red-400 focus:ring-red-500"
                      : "border-gray-300 dark:border-gray-700 focus:ring-purple-500"
                    }`}
                  />

                </div>

              </div>
              {/* ================= TRAINING CALCULATION ================= */}

{Number(employeesTrained) > 0 && Number(trainingHours) >= 0 && (
  <div className="mt-5 bg-purple-50 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-900/50 rounded-xl px-5 py-4">

    <div className="flex items-center justify-between">

      <div>

        <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
          Average Training Hours
        </p>

        <p className="text-2xl font-bold text-purple-700 dark:text-purple-300 mt-1">
          {(
            Number(trainingHours) /
            Number(employeesTrained)
          ).toFixed(2)}
        </p>

      </div>

      <div className="text-right">

        <p className="text-xs text-gray-500 dark:text-gray-400">
          Hours per trained employee
        </p>

              </div>

             </div>

          </div>
          )}
            {trainingError && (
                <div className="mt-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 rounded-xl px-4 py-3">

                  <p className="text-sm font-semibold text-red-700 dark:text-red-300">
                    ⚠ Invalid Training Data
                  </p>

                  <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                    {trainingError}
                  </p>

                </div>
              )}
          
          </div>

            {/* ================= SAFETY ================= */}

            <div className="mb-8">

              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                Health & Safety
              </h3>

              <div className="max-w-md">

                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Safety Incidents
                </label>

                <input
                  type="number"
                  placeholder="Enter safety incidents"
                  value={safetyIncidents}
                  onChange={(e) => setSafetyIncidents(e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border outline-none focus:ring-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-white ${
                    safetyError
                      ? "border-red-400 focus:ring-red-500"
                      : "border-gray-300 dark:border-gray-700 focus:ring-red-500"
                  }`}
                />

              </div>

            </div>

            {safetyError && (
            <div className="mt-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 rounded-xl px-4 py-3">

              <p className="text-sm font-semibold text-red-700 dark:text-red-300">
                ⚠ Invalid Safety Data
              </p>

              <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                {safetyError}
              </p>

            </div>
          )}

            {/* ================= CSR ================= */}

            <div className="mb-8">

              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                CSR & Community Engagement
              </h3>

              <div className="max-w-md">

                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  CSR Activities
                </label>

                <input
                  type="number"
                  placeholder="Enter CSR activities"
                  value={csrActivities}
                  onChange={(e) => setCsrActivities(e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border outline-none focus:ring-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-white ${
                    csrError
                      ? "border-red-400 focus:ring-red-500"
                      : "border-gray-300 dark:border-gray-700 focus:ring-green-500"
                  }`}
                />

              </div>

            </div>
            
              {csrError && (
              <div className="mt-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 rounded-xl px-4 py-3">

                <p className="text-sm font-semibold text-red-700 dark:text-red-300">
                  ⚠ Invalid CSR Data
                </p>

                <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                  {csrError}
                </p>

              </div>
            )}

            {/* ================= SAVE BUTTON ================= */}

            <div className="flex justify-end pt-5 border-t border-gray-100 dark:border-gray-700">

            <button
              type="submit"
              className={
                editId
                  ? "bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 hover:shadow-lg"
                  : "bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 hover:shadow-lg"
              }
            >
              {editId ? "Update Social Record" : "Save Social Record"}
            </button>

            </div>

          </form>
{/* ================= SOCIAL RECORDS ================= */}

<div className={`rounded-2xl border shadow-sm mt-8 overflow-hidden ${darkMode ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-200 text-gray-900"}`}>

  {/* Table Header */}

  <div className="px-8 py-6 border-b border-gray-200 dark:border-gray-700">

    <div className="flex justify-between items-center">

      <div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          Social Records
        </h2>

        <p className="text-gray-500 dark:text-gray-400 mt-1">
          View and monitor submitted social sustainability data.
        </p>
      </div>

      <div className="bg-green-100 dark:bg-green-900/60 text-green-700 dark:text-green-300 px-4 py-2 rounded-full text-sm font-semibold">
        {records.length} Records
      </div>

    </div>

  </div>


  {/* Table */}

  <div className="overflow-x-auto">

    <table className="w-full min-w-[700px]">

      <thead className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">

        <tr>

          <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">
            Employees
          </th>

          <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">
            Male
          </th>

          <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">
            Female
          </th>

          <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">
            Other
          </th>

          <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">
            Trained
          </th>

          <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">
            Training Hours
          </th>

          <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">
            Safety
          </th>

          <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">
            CSR
          </th>

          <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">
            Date
          </th>

          <th className="text-center px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">
            Actions
          </th>

        </tr>

      </thead>


      <tbody>

        {records.length === 0 ? (

          <tr>

            <td
              colSpan="12"
              className="text-center py-12 text-gray-500 dark:text-gray-400"
            >
              No social records found.
            </td>

          </tr>

        ) : (

          records.map((record) => (

            <tr
              key={record.id}
              className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">

              <td className="px-6 py-4 font-semibold text-gray-800 dark:text-white">
                {record.totalEmployees}
              </td>

              <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                {record.maleEmployees}
              </td>

              <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                {record.femaleEmployees}
              </td>

              <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                {record.otherEmployees ?? 0}
              </td>

              <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                {record.employeesTrained}
              </td>

              <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                {record.trainingHours}
              </td>

              <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                {record.safetyIncidents}
              </td>

              <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                {record.csrActivities}
              </td>

              <td className="px-6 py-4 text-gray-600 dark:text-gray-300 whitespace-nowrap">
                {record.createdAt?.toDate
                  ? record.createdAt.toDate().toLocaleDateString()
                  : "—"}
              </td>

              <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2">

                  {/* Edit Button */}

                  <button
                    type="button"
                    onClick={() => handleEdit(record)}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/60 transition"
                  >
                    <Pencil size={16} />
                    Edit
                  </button>


                  {/* Delete Button */}

                  <button
                    type="button"
                    onClick={() => {
                      setRecordToDelete(record);
                      setShowDeleteModal(true);
                    }}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-red-50 dark:bg-red-900/40 text-red-600 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/60 transition"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>

                  </div>
              </td>

            </tr>

          ))

        )}

      </tbody>

    </table>

  </div>

</div>
        </div>
        {/* ================= DELETE CONFIRMATION MODAL ================= */}

        {showDeleteModal && (

          <div className="fixed inset-0 z-50 flex items-center justify-center">

            {/* Background Overlay */}

            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => {
                setShowDeleteModal(false);
                setRecordToDelete(null);
              }}
            ></div>


            {/* Modal */}

            <div className={`relative w-full max-w-md mx-4 rounded-2xl shadow-2xl p-7 border ${darkMode ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-200 text-gray-900"}`}>

              {/* Icon */}

              <div className="w-14 h-14 rounded-full bg-red-100 dark:bg-red-900/60 flex items-center justify-center mx-auto">

                <Trash2
                  size={28}
                  className="text-red-600 dark:text-red-300"
                />

              </div>


              {/* Title */}

              <h2 className="text-xl font-bold text-gray-900 dark:text-white text-center mt-5">
                Delete Social Record?
              </h2>


              {/* Description */}

              <p className="text-gray-500 dark:text-gray-400 text-center mt-2 leading-relaxed">
                Are you sure you want to delete this social record?
                This action cannot be undone.
              </p>


              {/* Buttons */}

              <div className="flex justify-center gap-3 mt-7">

                {/* Cancel */}

                <button
                  type="button"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setRecordToDelete(null);
                  }}
                  className="px-5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                >
                  Cancel
                </button>


                {/* Confirm Delete */}

                <button
                  type="button"
                  onClick={handleDelete}
                  className="px-5 py-2.5 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 transition"
                >
                  Delete Record
                </button>

              </div>

            </div>

          </div>

        )}

      </div>

    </div>
  );
}

export default Social;