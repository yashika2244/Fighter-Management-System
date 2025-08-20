import { useEffect, useState } from "react";
import { api } from "../../lib/axios";
import Topbar from "../../components/Topbar";
import { Search, RotateCcw, Edit, FileDown, Calendar } from "lucide-react";
import ViewModel from "../../components/ViewModel";
import LeaveModal from "../../components/LeaveModal";
import { Upload } from "lucide-react";
import toast from "react-hot-toast";

export default function LookForUser() {
  const [q, setQ] = useState("");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedRow, setSelectedRow] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [openLeaveModal, setOpenLeaveModal] = useState(false);

  const load = async (query = "") => {
    try {
      setLoading(true);
      setError("");
      const { data } = await api.get("/users", { params: { q: query } });
      setRows(data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);
  const updateRow = (updatedUser) => {
    setRows((prev) =>
      prev.map((r) => (r._id === updatedUser._id ? updatedUser : r))
    );
  };

  return (
    <div className="p-6 min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-700 tracking-wide">
          👥 Search / Browse Users
        </h2>
        <Topbar />
      </div>

      {/* Search Bar */}
      <div className="flex gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            className="w-full border border-gray-300 rounded-xl pl-10 pr-4 py-2 shadow-sm focus:ring-2 focus:ring-blue-400 outline-none"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by name, force no, etc..."
          />
        </div>
        <button
          onClick={() => load(q)}
          className="flex items-center gap-2 bg-blue-500 text-white px-5 py-2 rounded-xl shadow hover:bg-blue-600 transition"
        >
          <Search size={16} /> Search
        </button>
        <button
          onClick={() => {
            setQ("");
            load("");
          }}
          className="flex items-center gap-2 bg-gray-200 px-5 py-2 rounded-xl shadow hover:bg-gray-300 transition"
        >
          <RotateCcw size={16} /> Reset
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-red-500 mb-4 text-center font-medium">{error}</p>
      )}

      {/* Loader */}
      {loading ? (
        <p className="text-gray-500 text-center text-lg">Loading...</p>
      ) : (
        <div className="overflow-hidden border border-gray-200 rounded-xl shadow bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-gradient-to-r from-blue-50 to-blue-100 text-gray-700 uppercase text-xs font-semibold">
              <tr>
                <th className="p-3 text-center">ID</th>
                <th className="p-3 text-center">Force No</th>
                <th className="p-3 text-center">Rank</th>
                <th className="p-3 text-center">Name</th>
                <th className="p-3 text-center">Mobile No</th>
                <th className="p-3 text-center">State</th>
                <th className="p-3 text-center">EL Availed</th>
                <th className="p-3 text-center">EL Due</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="text-center p-8 text-gray-500 italic"
                  >
                    No users found
                  </td>
                </tr>
              ) : (
                rows.map((r, idx) => {
                  const isSelected = selectedRow === idx;
                  return (
                    <tr
                      key={r._id || idx}
                      onClick={() => setSelectedRow(idx)}
                      className={`transition cursor-pointer ${
                        isSelected
                          ? "bg-blue-50 shadow-inner"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <td className="p-3 text-center font-medium text-gray-700">
                        {r.id || idx + 1}
                      </td>
                      <td className="p-3 text-center">{r.forceNo}</td>
                      <td className="p-3 text-center">{r.rank}</td>
                      <td className="p-3 text-center">{r.name}</td>
                      <td className="p-3 text-center">{r.mobileNo || "—"}</td>
                      <td className="p-3 text-center">{r.state || "—"}</td>
                      <td className="p-3 text-center">{r.elAvailed ?? 0}</td>
                      <td className="p-3 text-center">{r.elDue ?? 0}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-8 grid grid-cols-3 gap-4">
        <button
          onClick={() => {
            if (selectedRow !== null) setOpenModal(true);
          }}
          className="flex items-center justify-center gap-2 bg-gray-300  py-3 rounded-xl shadow hover:bg-gray-200 cursor-pointer transition"
        >
          <Edit size={18} /> View / Edit
        </button>
        <ViewModel
          open={openModal}
          onClose={() => setOpenModal(false)}
          user={rows[selectedRow]}
          onSave={(updatedUser) => {
            const newRows = [...rows];
            newRows[selectedRow] = updatedUser; // updated row replace
            setRows(newRows);
            toast.success("User updated successfully!");
          }}
        />
        <button
          onClick={() => {
            if (selectedRow !== null) setOpenLeaveModal(true);
          }}
          className="flex items-center justify-center gap-2 bg-gray-300  py-3 rounded-xl shadow hover:bg-gray-200 cursor-pointer transition"
        >
          <Calendar size={18} /> Leaves...
        </button>
        <LeaveModal
          open={openLeaveModal}
          onClose={() => setOpenLeaveModal(false)}
          user={rows[selectedRow]}
        />
        <input
          type="file"
          id="fileInput"
          accept=".csv,.xlsx"
          className="hidden"
          onChange={async (e) => {
            if (!e.target.files[0]) return;

            const formData = new FormData();
            formData.append("file", e.target.files[0]);

            try {
              setLoading(true);
              const res = await api.post("/upload/import", formData, {
                headers: { "Content-Type": "multipart/form-data" },
              });

              // Reload table after successful import
              load();

              toast.success(
                `✅ ${res.data.message} (${res.data.imported} imported, ${res.data.skipped} skipped)`
              );
            } catch (err) {
              console.error(err);
              toast.error(
                `❌ Import Failed: ${
                  err.response?.data?.message || err.message
                }`
              );
            } finally {
              setLoading(false);
              e.target.value = ""; // reset file input
            }
          }}
        />

        <button
          onClick={() => document.getElementById("fileInput").click()}
          className="flex items-center justify-center gap-2 bg-green-500 text-white py-3 rounded-xl shadow hover:bg-green-600 cursor-pointer transition"
        >
          <Upload size={18} /> Import Users
        </button>
      </div>
    </div>
  );
}
