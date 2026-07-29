import { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../config/firebase";
import MainLayout from "../layouts/MainLayout";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import {
  Leaf,
  Zap,
  Droplets,
  Database,
  Search,
  Pencil,
  Trash2,
  Save,
  Activity,
  Download,
} from "lucide-react";

function Environmental() {
  const [carbon, setCarbon] = useState("");
  const [energy, setEnergy] = useState("");
  const [water, setWater] = useState("");
  const [records, setRecords] = useState([]);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const fetchRecords = async () => {
  try {
    const q = query(
      collection(db, "environmentalData"),
      orderBy("createdAt", "desc")
    );
  const snapshot = await getDocs(q);
  const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setRecords(data);
    } catch (error) {
    console.error("Error fetching records:", error);
    }
    };
    useEffect(() => {
    fetchRecords();
    }, []);
  const totalCarbon = records.reduce(
  (sum, item) => sum + Number(item.carbon || 0),
  0
);

const totalEnergy = records.reduce(
  (sum, item) => sum + Number(item.energy || 0),
  0
);

const totalWater = records.reduce(
  (sum, item) => sum + Number(item.water || 0),
  0
);

const filteredRecords = records.filter((record) =>
  Object.values(record).join(" ").toLowerCase().includes(search.toLowerCase())
);
  const handleDelete = async (id) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this record?"
    );
if (!confirmDelete) return;
try {
    await deleteDoc(doc(db, "environmentalData", id));
fetchRecords();

  alert("Record deleted successfully!");
  } catch (error) {
    console.error(error);
    alert("Failed to delete record.");
  }
  };
  
  const handleEdit = (record) => {
  setCarbon(record.carbon);
  setEnergy(record.energy);
  setWater(record.water);
  setEditId(record.id);

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

    try {
      if (editId) {
    await updateDoc(doc(db, "environmentalData", editId), {
      carbon: Number(carbon),
      energy: Number(energy),
      water: Number(water),
    });
    }
    else {
    await addDoc(collection(db, "environmentalData"), {
      carbon: Number(carbon),
      energy: Number(energy),
      water: Number(water),
      createdAt: new Date(),
    });
    }
      
fetchRecords();

setCarbon("");
setEnergy("");
setWater("");
setEditId(null);

alert(
  editId
    ? "Record updated successfully!"
    : "Environmental data saved successfully!"
);

} catch (error) {
  console.error(error);
  alert("Failed to save data.");
}
};
const getStatus = (record) => {
  if (record.carbon > 700 || record.energy > 700 || record.water > 10000) {
    return {
      text: "High",
      color: "bg-red-100 text-red-700",
    };
  }

  if (record.carbon > 300 || record.energy > 300 || record.water > 5000) {
    return {
      text: "Moderate",
      color: "bg-yellow-100 text-yellow-700",
    };
  }

  return {
    text: "Good",
    color: "bg-green-100 text-green-700",
  };
};
const getCarbonStatus = () => {
  if (totalCarbon > 3000)
    return {
      text: "High",
      color: "text-red-600",
      bg: "bg-red-100",
    };

  if (totalCarbon > 1500)
    return {
      text: "Moderate",
      color: "text-yellow-600",
      bg: "bg-yellow-100",
    };

  return {
    text: "Good",
    color: "text-green-600",
    bg: "bg-green-100",
  };
};

const getEnergyStatus = () => {
  if (totalEnergy > 5000)
    return {
      text: "High",
      color: "text-red-600",
      bg: "bg-red-100",
    };

  if (totalEnergy > 2500)
    return {
      text: "Moderate",
      color: "text-yellow-600",
      bg: "bg-yellow-100",
    };

  return {
    text: "Good",
    color: "text-green-600",
    bg: "bg-green-100",
  };
};

const getWaterStatus = () => {
  if (totalWater > 80000)
    return {
      text: "High",
      color: "text-red-600",
      bg: "bg-red-100",
    };

  if (totalWater > 40000)
    return {
      text: "Moderate",
      color: "text-yellow-600",
      bg: "bg-yellow-100",
    };

  return {
    text: "Good",
    color: "text-green-600",
    bg: "bg-green-100",
  };
};

const handleExportCSV = () => {
  if (records.length === 0) {
    alert("No records available to export.");
    return;
  }

  const headers = [
    "Status",
    "Carbon (tCO₂)",
    "Energy (kWh)",
    "Water (L)",
    "Date",
  ];

  const csvData = records.map((record) => [
    getStatus(record).text,
    record.carbon,
    record.energy,
    record.water,
    record.createdAt?.toDate().toLocaleDateString(),
  ]);

  const csvContent = [
    headers.join(","),
    ...csvData.map((row) => row.join(",")),
  ].join("\n");

  const blob = new Blob([csvContent], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "Environmental_Records.csv";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
};

const handleExportPDF = () => {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("Environmental Records Report", 14, 20);

  autoTable(doc, {
    startY: 30,
    head: [[
      "Status",
      "Carbon (tCO₂)",
      "Energy (kWh)",
      "Water (L)",
      "Date"
    ]],
    body: records.map((record) => [
      getStatus(record).text,
      record.carbon,
      record.energy,
      record.water,
      record.createdAt?.toDate().toLocaleDateString(),
    ]),
  });

  doc.save("Environmental_Records_Report.pdf");
};

return (
<MainLayout>
<div className="bg-gray-100 min-h-screen">

{/* Main Content */}
<div>

{/*  HEADER  */}

<div className="fixed top-0 left-64 right-0 bg-white border-b border-gray-200 z-40">

  <div className="px-10 py-6 flex justify-between items-center">

    <div>

      <h1 className="text-4xl font-bold text-gray-900">
        Environmental Management
      </h1>

      <p className="text-gray-500 mt-2 text-lg">
        Monitor and manage your organization's environmental sustainability
        metrics.
      </p>

    </div>

    <div className="flex items-center gap-3">

<div className="hidden md:flex items-center gap-3 bg-green-50 border border-green-300 px-5 py-2 rounded-full shadow-lg shadow-green-200/60">

  <span className="relative flex h-3 w-3">
    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-600"></span>
  </span>
  <span className="font-semibold">
    Live System
  </span>

</div>

</div>

  </div>

</div>

{/* Form */}
<div className="p-10 pt-40 space-y-8">
  {/* ================= KPI CARDS ================= */}

<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

  {/* Carbon */}

  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

    <div className="flex justify-between items-center">

      <div>

        <p className="text-gray-500 text-sm">
          Total Carbon
        </p>

        <h2 className="text-3xl font-bold mt-2">
          {totalCarbon}
        </h2>

  <div className="flex items-center justify-between mt-4">

  <span className="text-sm text-gray-500">
    tCO₂
  </span>

  <span
    className={`text-xs font-semibold px-3 py-1 rounded-full ${getCarbonStatus().bg} ${getCarbonStatus().color}`}
  >
    {getCarbonStatus().text}
  </span>

</div>

      </div>

      <div className="bg-green-100 p-4 rounded-xl">

        <Leaf className="text-green-600" size={28} />

      </div>

    </div>

  </div>

  {/* Energy */}

  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

    <div className="flex justify-between items-center">

      <div>

        <p className="text-gray-500 text-sm">
          Energy Usage
        </p>

        <h2 className="text-3xl font-bold mt-2">
          {totalEnergy}
        </h2>

        <div className="flex items-center gap-2 mt-2">

  <span className="text-sm text-gray-500">
    kWh
  </span>

  <span className="text-xs font-semibold px-2 py-1 rounded-full bg-yellow-100 text-yellow-700">
    ↑ 8%
  </span>

</div>

      </div>

      <div className="bg-yellow-100 p-4 rounded-xl">

        <Zap className="text-yellow-600" size={28} />

      </div>

    </div>

  </div>

  {/* Water */}

  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

    <div className="flex justify-between items-center">

      <div>

        <p className="text-gray-500 text-sm">
          Water Usage
        </p>

        <h2 className="text-3xl font-bold mt-2">
          {totalWater}
        </h2>

        <div className="flex items-center gap-2 mt-2">

  <span className="text-sm text-gray-500">
    Litres
  </span>

  <span className="text-xs font-semibold px-2 py-1 rounded-full bg-blue-100 text-blue-700">
    ↓ 4%
  </span>

</div>

      </div>

      <div className="bg-blue-100 p-4 rounded-xl">

        <Droplets className="text-blue-600" size={28} />

      </div>

    </div>

  </div>

  {/* Records */}

  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

    <div className="flex justify-between items-center">

      <div>

        <p className="text-gray-500 text-sm">
          Total Records
        </p>

        <h2 className="text-3xl font-bold mt-2">
          {records.length}
        </h2>

        <div className="flex items-center gap-2 mt-2">

  <span className="text-sm text-gray-500">
    Entries
  </span>

  <span className="text-xs font-semibold px-2 py-1 rounded-full bg-purple-100 text-purple-700">
    Live
  </span>

</div>

      </div>

      <div className="bg-purple-100 p-4 rounded-xl">

        <Database className="text-purple-600" size={28} />

      </div>

    </div>

  </div>

</div>
    <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200 w-full">
      {/* ================= DATA ENTRY CARD ================= */}

<div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

  {/* Card Header */}

  <div className="px-8 py-5 border-b bg-gray-50">

    <h2 className="text-2xl font-bold text-gray-800">
      Add Environmental Record
    </h2>

    <p className="text-gray-500 mt-1">
      Enter the latest environmental sustainability metrics.
    </p>

  </div>

  <form onSubmit={handleSubmit} className="p-8 space-y-8">

    {/* First Row */}

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

      {/* Carbon */}

      <div>

        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Carbon Emissions (tCO₂)
        </label>

        <input
          type="number"
          value={carbon}
          onChange={(e) => setCarbon(e.target.value)}
          placeholder="e.g. 125"
          className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
          required
        />

      </div>

      {/* Energy */}

      <div>

        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Energy Usage (kWh)
        </label>

        <input
          type="number"
          value={energy}
          onChange={(e) => setEnergy(e.target.value)}
          placeholder="e.g. 540"
          className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition"
          required
        />

      </div>

    </div>

    {/* Water */}

    <div>

      <label className="block text-sm font-semibold text-gray-700 mb-2">
        Water Consumption (Litres)
      </label>

      <input
        type="number"
        value={water}
        onChange={(e) => setWater(e.target.value)}
        placeholder="e.g. 6500"
        className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
        required
      />

    </div>

    {/* Button */}

    <div className="flex justify-end border-t border-gray-200 pt-6">

      <button
        type="submit"
        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-lg"
      >
        <Save size={18} />

        {editId ? "Update Record" : "Save Record"}

      </button>

    </div>

  </form>

</div>

{/* ================= RECORDS HEADER ================= */}

<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mt-10 mb-6">

  <div>

    <h2 className="text-3xl font-bold text-gray-800">
      Environmental Records
    </h2>

    <p className="text-gray-500 mt-1">
      Search, edit and manage all environmental submissions.
    </p>

  </div>

  {/* Search */}

  <div className="flex flex-col sm:flex-row items-center gap-4">

  {/* Search */}

  <div className="relative w-full sm:w-80">

    <Search
      size={18}
      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
    />

    <input
      type="text"
      placeholder="Search records..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="w-full rounded-xl border border-gray-300 py-3 pl-11 pr-4 focus:ring-2 focus:ring-green-500 outline-none"
    />

  </div>

  {/* Export Button */}

<button
  onClick={handleExportCSV}
  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-xl font-medium transition"
>
  <Download size={18} />
  Export CSV
</button>

<button
  onClick={handleExportPDF}
  className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-xl font-medium transition"
>
  <Download size={18} />
  Export PDF
</button>
</div>

</div>


<div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
  <table className="w-full">
<thead className="bg-gray-100">
    <tr>
      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
  Status
</th>
    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
  Carbon (tCO₂)
</th>

<th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
  Energy (kWh)
</th>

<th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
  Water (L)
</th>

<th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
  Date
</th>

<th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
  Actions
</th>
    </tr>
    </thead>

<tbody>
  {filteredRecords.length > 0 ? (
    filteredRecords.map((record) => (
        <tr
  key={record.id}
  className="border-b border-gray-100 hover:bg-green-50 transition-all duration-200">
  <td className="px-6 py-4 align-middle">
  <div className="flex items-center h-full">
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatus(record).color}`}
    >
      {getStatus(record).text}
    </span>
  </div>
</td>
  <td className="px-6 py-4 text-gray-700">
  {record.carbon}
</td>

  <td className="px-6 py-4 text-gray-700">
    {record.energy}
  </td>

  <td className="px-6 py-4 text-gray-700">
    {record.water}
  </td>

  <td className="px-6 py-4 text-gray-700">
    {record.createdAt?.toDate().toLocaleDateString()}
  </td>

  <td className="px-6 py-4">

<div className="flex justify-center gap-2">

  <button
    onClick={() => handleEdit(record)}
    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
  >
    <Pencil size={16} />
    Edit
  </button>

  <button
    onClick={() => handleDelete(record.id)}
    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition"
  >
    <Trash2 size={16} />
    Delete
  </button>

</div>
  </td>
  </tr>
        ))
  ) : (
    <tr>
      <td colSpan="5" className="py-16 text-center">
        <div className="flex flex-col items-center">
          <Database size={50} className="text-gray-300 mb-4" />

          <h3 className="text-xl font-semibold text-gray-700">
            No Records Found
          </h3>

          <p className="text-gray-500 mt-2">
            Try adding a new record or change your search.
          </p>
        </div>
      </td>
    </tr>
  )}
</tbody>
</table>
</div>
          </div>
        </div>
      </div>
    </div>
</MainLayout>
);
}

export default Environmental;