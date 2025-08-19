
import { useEffect, useState } from "react";
import { api } from "../lib/axios";
import Topbar from "./Topbar";

export default function DutyAssign() {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [users, setUsers] = useState([]);
  const [duties, setDuties] = useState([]);
  
  const [form, setForm] = useState({
    user: "",
    dutyType: "",
    subCategory: "",   // ✅ new field
    fromTime: "",
    toTime: "",
  });
  const [subCategories, setSubCategories] = useState([]); // ✅ state for subcategories
  const [time, setTime] = useState(new Date());

  // NEW: track selected row
  const [selectedDuty, setSelectedDuty] = useState(null);

  useEffect(() => {
    loadUsers();
    loadDuties();
  }, [date]);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const loadUsers = async () => {
    const { data } = await api.get("/users");
    setUsers(data);
  };

  const loadDuties = async () => {
    const { data } = await api.get("/duties", { params: { date } });
    setDuties(data);
  };

const loadSubCategories = async (dutyType) => {
  if (!dutyType) {
    setSubCategories([]);
    setForm((prev) => ({ ...prev, subCategory: "" }));  // 👈 only subCategory reset
    return;
  }
  const { data } = await api.get(`/duties/subcategories/${dutyType}`);
  setSubCategories(data);
  setForm((prev) => ({ ...prev, subCategory: "" }));  // 👈 only subCategory reset
};


  const assignDuty = async () => {
    if (!form.user || !form.dutyType || !form.fromTime || !form.toTime) return;

    // if dutyType needs subCategory and it's empty → block
    if ((form.dutyType === "Camp Security" || form.dutyType === "Camp Adm Duty") && !form.subCategory) {
      alert("Please select sub-category for this duty type");
      return;
    }

    await api.post("/duties", { ...form, dutyDate: date });
    setForm({ user: "", dutyType: "", subCategory: "", fromTime: "", toTime: "" });
    loadDuties();
  };

  const getDutyColor = (type) => {
    switch (type) {
      case "Naka Duty": return " text-blue-800";
      case "Minority Patroling": return " text-purple-800";
      case "Camp Security": return " text-green-800";
      case "Camp Adm Duty": return " text-yellow-800";
      case "OC Protection Duty": return " text-red-800";
      default: return " text-gray-800";
    }
  };

  // NEW: delete function
  const deleteDuty = async (id) => {
    await api.delete(`/duties/${id}`);
    setSelectedDuty(null);
    loadDuties();
  };

  return (
    <div className="px-6 py-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-800">CHM — Duty Assignment</h2>
        <Topbar />
      </div>

      {/* Assign Duty Card */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 max-w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <h3 className="text-2xl font-semibold text-cyan-700 bg-clip-text sm:mb-0">
            Assign New Duty
          </h3>
          <div className="text-sm text-gray-500 font-mono bg-gray-100 px-3 py-1 rounded-sm">
            {time.toLocaleDateString()} | {time.toLocaleTimeString()}
          </div>
        </div>

        {/* Form Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6 items-end">
          {/* Date */}
          <div className="relative ">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="peer block w-full rounded-md border border-gray-300 bg-gray-50 px-4 pt-5 pb-2 text-sm text-gray-900 shadow-sm focus:ring-1 focus:ring-indigo-400 focus:border-indigo-500 transition outline-none"
              placeholder=" "
            />
            <label className="absolute left-5 top-2 text-gray-500 text-xs transition-all peer-placeholder-shown:top-5 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs">
              Date
            </label>
          </div>

          {/* Personnel */}
          <div className="relative col-span-1 sm:col-span-2 outline-none">
            <select
              value={form.user}
              onChange={(e) => setForm({ ...form, user: e.target.value })}
              className="peer block w-full rounded-md border border-gray-300 bg-gray-50 px-4 pt-5 pb-2 text-sm text-gray-900 shadow-sm focus:ring-1 focus:ring-indigo-400 focus:border-indigo-500 transition"
            >
              <option value="">Select Personnel</option>
              {users.map((u) => (
                <option key={u._id} value={u._id}>
                  {u.serviceNo} {u.rank} {u.name}
                </option>
              ))}
            </select>
            <label className="absolute left-5 top-2 text-gray-500 text-xs transition-all peer-focus:top-2 peer-focus:text-xs">
              Personnel
            </label>
          </div>

          {/* Duty Type */}
          <div className="relative">
            <select
              value={form.dutyType}
  onChange={(e) => {
    setForm((prev) => ({ ...prev, dutyType: e.target.value })); // 👈 safe update
    loadSubCategories(e.target.value);
              }}
              className="peer block w-full rounded-md border border-gray-300 bg-gray-50 px-4 pt-5 pb-2 text-sm text-gray-900 shadow-sm focus:ring-1 focus:ring-indigo-400 focus:border-indigo-500 transition outline-none"
            >
              <option value="">Select Duty</option>
              <option value="Naka Duty">Naka Duty</option>
              <option value="Minority Patroling">Minority Patroling</option>
              <option value="Camp Security">Camp Security</option>
              <option value="Camp Adm Duty">Camp Adm Duty</option>
              <option value="OC Protection Duty">OC Protection Duty</option>
            </select>
            <label className="absolute left-5 top-2 text-gray-500 text-xs transition-all peer-focus:top-2 peer-focus:text-xs">
              Duty Type
            </label>
          </div>

          {/* Sub Category (only show if available) */}
          {subCategories.length > 0 && (
            <div className="relative">
              <select
                value={form.subCategory}
                onChange={(e) => setForm({ ...form, subCategory: e.target.value })}
                className="peer block w-full rounded-md border border-gray-300 bg-gray-50 px-4 pt-5 pb-2 text-sm text-gray-900 shadow-sm focus:ring-1 focus:ring-indigo-400 focus:border-indigo-500 transition outline-none"
              >
                <option value="">Select Sub Category</option>
                {subCategories.map((s, i) => (
                  <option key={i} value={s}>{s}</option>
                ))}
              </select>
              <label className="absolute left-5 top-2 text-gray-500 text-xs transition-all peer-focus:top-2 peer-focus:text-xs">
                Sub Category
              </label>
            </div>
          )}

          {/* From Time */}
          <div className="relative">
            <input
              type="time"
              value={form.fromTime}
              onChange={(e) => setForm({ ...form, fromTime: e.target.value })}
              className="peer block w-full rounded-md border border-gray-300 bg-gray-50 px-4 pt-5 pb-2 text-sm text-gray-900 shadow-sm focus:ring-1 focus:ring-indigo-400 focus:border-indigo-500 transition outline-none"
              placeholder=""
            />
            <label className="absolute left-4 top-2 text-gray-500 text-xs transition-all peer-focus:top-2 peer-focus:text-xs">
              From
            </label>
          </div>

          {/* To Time */}
          <div className="relative">
            <input
              type="time"
              value={form.toTime}
              onChange={(e) => setForm({ ...form, toTime: e.target.value })}
              className="peer block w-full rounded-md border border-gray-300 bg-gray-50 px-4 pt-5 pb-2 text-sm text-gray-900 shadow-sm focus:ring-1 focus:ring-indigo-400 focus:border-indigo-500 transition outline-none"
              placeholder=" "
            />
            <label className="absolute left-4 top-2 text-gray-500 text-xs transition-all peer-focus:top-2 peer-focus:text-xs">
              To
            </label>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              onClick={assignDuty}
              className="bg-cyan-600 hover:bg-cyan-700 cursor-pointer text-white font-semibold py-3 px-6 rounded-xl shadow transition-all duration-200"
            >
              Assign Duty
            </button>
          </div>
        </div>
      </div>

      {/* Duties Table */}
      <div className="bg-white shadow-md rounded-xl border border-gray-200 mt-4">
        <div className="max-h-85 overflow-y-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th className="px-4 py-2 text-xs font-bold text-gray-700 uppercase">ID</th>
                <th className="px-4 py-2 text-xs font-bold text-gray-700 uppercase">Date</th>
                <th className="px-4 py-2 text-xs font-bold text-gray-700 uppercase">From</th>
                <th className="px-4 py-2 text-xs font-bold text-gray-700 uppercase">To</th>
                <th className="px-4 py-2 text-xs font-bold text-gray-700 uppercase">Force No</th>
                <th className="px-4 py-2 text-xs font-bold text-gray-700 uppercase">Rank</th>
                <th className="px-4 py-2 text-xs font-bold text-gray-700 uppercase">Name</th>
                <th className="px-4 py-2 text-xs font-bold text-gray-700 uppercase">Duty Type</th>
                <th className="px-4 py-2 text-xs font-bold text-gray-700 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {duties.length > 0 ? (
                duties.map((d, i) => (
                  <tr
                    key={d._id}
                    className={`hover:bg-gray-50 transition cursor-pointer ${
                      selectedDuty === d._id ? "bg-gray-100" : ""
                    }`}
                    onClick={() =>
                      setSelectedDuty(selectedDuty === d._id ? null : d._id)
                    }
                  >
                    <td className="px-4 py-2 text-sm text-center text-gray-700">{i + 1}</td>
                    <td className="px-4 py-2 text-sm text-center text-gray-700">{d.dutyDate.slice(0, 10)}</td>
                    <td className="px-4 py-2 text-sm text-center text-gray-700">{d.fromTime}</td>
                    <td className="px-4 py-2 text-sm text-center text-gray-700">{d.toTime}</td>
                    <td className="px-4 py-2 text-sm text-center text-gray-700">{d.user?.forceNo || "-"}</td>
                    <td className="px-4 py-2 text-sm text-center text-gray-700">{d.user?.rank || "-"}</td>
                    <td className="px-4 py-2 text-sm text-center text-gray-700">{d.user?.name || "-"}</td>
                    <td className={`px-2 py-1 text-xs font-semibold  text-center ${getDutyColor(d.dutyType)}`}>
                      {d.dutyType || "-"}
                    </td>
                    <td className="text-center">
                      {selectedDuty === d._id && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteDuty(d._id);
                          }}
                          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                        >
                          Delete Selected
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10" className="px-4 py-6 text-center text-gray-400">
                    No duties assigned for this date.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
