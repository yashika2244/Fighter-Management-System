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
    fromTime: "",
    toTime: "",
  });
  const [time, setTime] = useState(new Date());

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
    console.log("Duties fetched:", data);
    setDuties(data);
  };

  const assignDuty = async () => {
    if (!form.user || !form.dutyType || !form.fromTime || !form.toTime) return;
    await api.post("/duties", { ...form, dutyDate: date });
    setForm({ user: "", dutyType: "", fromTime: "", toTime: "" });
    loadDuties();
  };

  const deleteDuty = async (id) => {
    await api.delete(`/duties/${id}`);
    loadDuties();
  };

  return (
    <div className="px-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">CHM — Duty Assignment</h2>
        <Topbar />
      </div>

      {/* Controls */}
      <div className="border-2 p-2 rounded-sm border-gray-400">
        <div className="flex flex-wrap items-center justify-between p-4">
          <div className="flex flex-wrap items-center gap-4">
            {/* Date */}
            <div>
              <label className="mr-2">Date:</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="border border-gray-300 px-2 rounded text-sm"
              />
            </div>

            {/* Personnel */}
            <div>
              <label className="mr-2">Personnel:</label>
              <select
                value={form.user}
                onChange={(e) => setForm({ ...form, user: e.target.value })}
                className="border border-gray-300 px-2 rounded text-sm"
              >
                <option value="">Select Personnel</option>
                {users.map((u) => (
                  <option key={u._id} value={u._id}>
                    {u.serviceNo} {u.rank} {u.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Duty */}
            <div>
              <label className="mr-2">Duty:</label>
              <select
                value={form.dutyType}
                onChange={(e) => setForm({ ...form, dutyType: e.target.value })}
                className="border border-gray-300 px-2 rounded text-sm"
              >
                <option value="">Select Duty</option>
                <option value="Naka Duty">Naka Duty</option>
  <option value="Minority Patroling">Minority Patroling</option>
  <option value="Camp Security">Camp Security</option>
  <option value="Camp Adm Duty">Camp Adm Duty</option>
  <option value="OC Protection Duty">OC Protection Duty</option>
              </select>
            </div>

            {/* From - To Time */}
            <div>
              <label className="mr-2">From:</label>
              <input
                type="time"
                value={form.fromTime}
                onChange={(e) => setForm({ ...form, fromTime: e.target.value })}
                className="border border-gray-300 px-2 rounded text-sm"
              />
            </div>
            <div>
              <label className="mr-2">To:</label>
              <input
                type="time"
                value={form.toTime}
                onChange={(e) => setForm({ ...form, toTime: e.target.value })}
                className="border border-gray-300 px-2 rounded text-sm"
              />
            </div>

            {/* Submit button */}
            <div>

            </div>
            <div className="flex justify-end gap-4">

           
            <button
              onClick={assignDuty}
              className="bg-indigo-600 text-white px-4 py-1 rounded shadow"
            >
              Assign Duty
            </button>
          {/* Clock */}
          <div className="text-right flex gap-1 items-center">
            <div className="text-sm text-gray-600">
              {time.toLocaleDateString()}
            </div>
            <div className="text-sm text-gray-600">
              {time.toLocaleTimeString()}
            </div>
          </div>
           </div>
          </div>

        </div>
  

      {/* Duty Table */}
      <div className="overflow-x-auto border-2 border-gray-200 rounded mt-3">
        <table className="w-full text-sm text-gray-600">
          <thead className="bg-gray-50 text-gray-800 font-semibold">
            <tr>
              <th className="p-2">ID</th>
              <th className="p-2">Date</th>
              <th className="p-2">From</th>
              <th className="p-2">To</th>
              <th className="p-2">Force No</th>
              <th className="p-2">Rank</th>
              <th className="p-2">Name</th>
            </tr>
          </thead>
          <tbody>
            {duties.length > 0 ? (
              duties.map((d, i) => (
                <tr key={d._id}>
                  <td className="p-2 text-center">{i + 1}</td>
                  <td className="p-2 text-center">{d.dutyDate.slice(0, 10)}</td>
                  <td className="p-2 text-center">{d.fromTime}</td>
                  <td className="p-2 text-center">{d.toTime}</td>
                  <td className="p-2 text-center">{d.user?.forceNo || "-"}</td>
                  <td className="p-2 text-center">{d.user?.rank || "-"}</td>
                  <td className="p-2 text-center">{d.user?.name || "-"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="p-4 text-center text-gray-500">
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
