import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { api } from "../lib/axios";

export default function LeaveModal({ open, onClose, user, refreshUser }) {
  if (!open) return null;

  const [form, setForm] = useState({
    from: "",
    to: "",
    type: "EL",
    reason: "",
  });

  const [leaves, setLeaves] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);

  // Fetch leaves when modal opens
  useEffect(() => {
    if (open && user?._id) {
      api.get(`/leaves/${user._id}`).then((res) => setLeaves(res.data));
    }
  }, [open, user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Add a new leave
  const addLeave = async () => {
    if (!form.from || !form.to || !form.reason) return;
    try {
      const { data } = await api.post("/leaves", { ...form, user: user._id });
       setLeaves([...leaves, data.leave]);  
      setForm({ from: "", to: "", type: "EL", reason: "" });
      refreshUser?.(); // refresh EL/CL counts if needed
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to add leave");
    }
  };

  // Delete selected leaves
  const deleteSelected = async () => {
    if (selectedIds.length === 0) return;
    try {
      await api.post("/leaves/delete", { ids: selectedIds });
      setLeaves(leaves.filter((l) => !selectedIds.includes(l._id)));
      setSelectedIds([]);
      refreshUser?.();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to delete leaves");
    }
  };

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
      <div className="bg-white w-full max-w-4xl rounded-md shadow-2xl flex flex-col h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-6 py-3 bg-gray-50 border-b border-gray-200 gap-2">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <h2 className="text-lg font-semibold text-gray-800">
              Leaves — <span className="text-indigo-600">{user?.name}</span>
            </h2>
            <span className="text-gray-500 text-sm">({user?.forceNo})</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-2 sm:mt-0 w-full sm:w-auto">
            {/* EL Usage */}
            <div className="flex flex-col w-full sm:w-32">
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span>EL</span>
                <span>
                  {user?.elUsed ?? 0}/{user?.elTotal ?? 60}
                </span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-2 bg-indigo-600"
                  style={{
                    width: `${
                      ((user?.elUsed ?? 0) / (user?.elTotal ?? 60)) * 100
                    }%`,
                  }}
                ></div>
              </div>
            </div>

            {/* CL Usage */}
            <div className="flex flex-col w-full sm:w-32">
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span>CL</span>
                <span>
                  {user?.clUsed ?? 0}/{user?.clTotal ?? 15}
                </span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-2 bg-green-600"
                  style={{
                    width: `${
                      ((user?.clUsed ?? 0) / (user?.clTotal ?? 15)) * 100
                    }%`,
                  }}
                ></div>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-full transition mt-2 sm:mt-0"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Add Leave Form */}
        <div className="px-6 py-5 bg-white rounded-lg shadow-sm">
          <h3 className="text-base font-semibold text-gray-800 mb-4">
            Add Leave
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-600 mb-1">
                From Date
              </label>
              <input
                type="date"
                name="from"
                value={form.from}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg outline-none px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-600 mb-1">
                To Date
              </label>
              <input
                type="date"
                name="to"
                value={form.to}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg outline-none px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-600 mb-1">
                Type
              </label>
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className="border border-gray-300 outline-none rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="EL">EL</option>
                <option value="CL">CL</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-600 mb-1">
                Reason
              </label>
              <input
                type="text"
                name="reason"
                value={form.reason}
                onChange={handleChange}
                placeholder="Enter reason"
                className="border border-gray-300 outline-none rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
          <div className="mt-4">
            <button
              onClick={addLeave}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition shadow-sm"
            >
              + Add Leave
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto px-4 mt-4">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 sticky top-0 z-10">
              <tr className="text-left text-gray-700">
                <th className="p-2 text-center">
                  <input
                    type="checkbox"
                    checked={
                      leaves.length > 0 && selectedIds.length === leaves.length
                    }
                    onChange={(e) =>
                      setSelectedIds(
                        e.target.checked ? leaves.map((l) => l._id) : []
                      )
                    }
                  />
                </th>
                <th className="p-2 text-center">ID</th>
                <th className="p-2 text-center">From</th>
                <th className="p-2 text-center">To</th>
                <th className="p-2 text-center">Type</th>
                <th className="p-2 text-center">Reason</th>
              </tr>
            </thead>
            <tbody>
              {leaves.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center p-6 text-gray-400">
                    No Leaves Added
                  </td>
                </tr>
              ) : (
                leaves.map((l, idx) => (
                  <tr
                    key={l._id}
                    className={`${
                      idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                    } hover:bg-gray-100`}
                  >
                    <td className="p-2 text-center">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(l._id)}
                        onChange={() => toggleSelect(l._id)}
                      />
                    </td>
                    <td className="p-2 text-center">{idx + 1}</td>
                    <td className="p-2 text-center">
                      {new Date(l.from).toLocaleDateString()}
                    </td>
                    <td className="p-2 text-center">
                      {new Date(l.to).toLocaleDateString()}
                    </td>
                    <td className="p-2 text-center">{l.type}</td>
                    <td className="p-2 text-center">{l.reason}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center px-6 py-3 border-t border-gray-300 bg-gray-50">
          <button
            onClick={deleteSelected}
            disabled={selectedIds.length === 0}
            className="bg-red-100 text-red-600 px-4 py-2 rounded-lg text-sm hover:bg-red-200 transition disabled:opacity-50"
          >
            Delete Selected
          </button>
          <button
            onClick={onClose}
            className="bg-gray-200 px-4 py-2 rounded-lg text-sm hover:bg-gray-300 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
