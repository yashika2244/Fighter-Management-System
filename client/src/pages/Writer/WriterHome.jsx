
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import Topbar from "../../components/Topbar.jsx";
// import PageCard from "../../components/PageCard.jsx";
// import AvailabilityOnDateModal from "./AvailabilityOnDate.jsx";

// export default function WriterHome() {
//   const [q, setQ] = useState("");
//   const [range, setRange] = useState("Last 30 days");
//   const nav = useNavigate();
//   const [openAvailability, setOpenAvailability] = useState(false);
//   const [uploadMsg, setUploadMsg] = useState("");

//   const handleFileUpload = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     const formData = new FormData();
//     formData.append("file", file);

//     try {
//       const res = await axios.post(
//         import.meta.env.VITE_API_URL + "/upload/import",
//         formData,
//         {
//           headers: { "Content-Type": "multipart/form-data" },
//         }
//       );
//   setUploadMsg(`✅ ${res.data.message} (${res.data.imported} imported, ${res.data.skipped} skipped)`);

//     } catch (err) {
//       console.error(err);
//       setUploadMsg(
//         `❌ Upload failed: ${err.response?.data?.message || err.message}`
//       );
//     }
//   };

//   return (
//     <div className="h-screen flex flex-col p-2">
//       <div className="flex justify-between px-4">
//         <h1 className="text-lg font-bold">Writer-Home</h1>
//         <Topbar query={q} setQuery={setQ} range={range} setRange={setRange} />
//       </div>

//       <div className="px-8">
//         <h1 className="text-xl text-center mt-5 font-semibold mb-6">
//           Writer — choose an action
//         </h1>
//         <div className="flex gap-6">
//           <PageCard title="Feed New User" onClick={() => nav("/writer/new")} />
//           <PageCard title="Look for any user" onClick={() => nav("/writer/search")} />
//           <PageCard
//             title="Availability on Date"
//             onClick={() => setOpenAvailability(true)}
//           />
//         </div>

//         {/* Import CSV */}
//         <div className="mt-auto fixed bottom-6 left-72">
//           <label className="mr-2 text-sm bg-gray-200 px-3 py-2 rounded-sm cursor-pointer">
//             Import Excel/CSV
//             <input
//               type="file"
//               className="hidden"
//               onChange={handleFileUpload}
//               accept=".csv,.xlsx"
//             />
//           </label>
//           {uploadMsg && <p className="text-sm mt-2">{uploadMsg}</p>}
//         </div>
//       </div>

//       <AvailabilityOnDateModal
//         open={openAvailability}
//         onClose={() => setOpenAvailability(false)}
//       />
//     </div>
//   );
// }

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../lib/axios";
import Topbar from "../../components/Topbar.jsx";
import AvailabilityOnDateModal from "./AvailabilityOnDate.jsx";
import EmployeeModal from "../../components/EmployeeModal.jsx";
import { Plus, CalendarDays } from "lucide-react";

export default function WriterHome() {
  const [q, setQ] = useState("");
  const [range, setRange] = useState("30");
  const nav = useNavigate();
  const [openAvailability, setOpenAvailability] = useState(false);
  const [uploadMsg, setUploadMsg] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await api.post(
        import.meta.env.VITE_API_URL + "/upload/import",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setUploadMsg(
        `✅ ${res.data.message} (${res.data.imported} imported, ${res.data.skipped} skipped)`
      );
    } catch (err) {
      console.error(err);
      setUploadMsg(
        `❌ Upload failed: ${err.response?.data?.message || err.message}`
      );
    }
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data } = await api.get("/users");
        if (mounted) setUsers(data);
      } catch (e) {
        console.error(e);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return users;
    return users.filter((u) => {
      return (
        (u.forceNo || "").toLowerCase().includes(term) ||
        (u.name || "").toLowerCase().includes(term) ||
        (u.rank || "").toLowerCase().includes(term) ||
        (u.mobileNo || "").toLowerCase().includes(term)
      );
    });
  }, [q, users]);

  const refreshUsers = async () => {
    try {
      const { data } = await api.get("/users");
      setUsers(data);
      if (selectedUser) {
        const refreshed = data.find((u) => u._id === selectedUser._id);
        if (refreshed) setSelectedUser(refreshed);
      }
    } catch (e) {}
  };

  // Debug logging
  console.log('WriterHome state:', { 
    showEmployeeModal, 
    selectedUser: selectedUser?.name, 
    usersCount: users.length 
  });

  return (
    <div className="min-h-screen flex flex-col p-2 sm:p-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-2 sm:px-4 mb-4">
        <h1 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-0 text-gray-900">Writer</h1>
        <Topbar query={q} setQuery={setQ} range={range} setRange={setRange} />
      </div>

      {/* Toolbar */}
      <div className="px-2 sm:px-4 mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => nav("/writer/new")}
            className="inline-flex items-center gap-2 bg-gray-900 text-white px-3 py-2 rounded-md text-sm hover:bg-black/90"
          >
            <Plus size={16} />
            Add New Employee
          </button>
          <button
            onClick={() => setOpenAvailability(true)}
            className="inline-flex items-center gap-2 bg-gray-100 text-gray-800 px-3 py-2 rounded-md text-sm hover:bg-gray-200 border border-gray-200"
          >
            <CalendarDays size={16} />
            Check Availability
          </button>
        </div>

        {/* Import CSV */}
        <div className="flex items-center gap-2">
          <label className="text-xs sm:text-sm bg-gray-100 border border-gray-200 px-3 py-2 rounded-md cursor-pointer hover:bg-gray-200">
            Import CSV/XLSX
            <input
              type="file"
              className="hidden"
              onChange={handleFileUpload}
              accept=".csv,.xlsx"
            />
          </label>
          {uploadMsg && <p className="text-xs sm:text-sm text-gray-600">{uploadMsg}</p>}
        </div>
      </div>

      {/* Users Table */}
      <div className="px-2 sm:px-4 flex-1">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-6 text-center text-gray-500">Loading users…</div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Force No</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Rank</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Mobile</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {filtered.map((u) => (
                    <tr
                      key={u._id}
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => {
                        console.log('Row clicked for user:', u.name);
                        setSelectedUser(u);
                        setShowEmployeeModal(true);
                        console.log('Modal state set to:', true);
                      }}
                    >
                      <td className="px-4 py-2 text-sm text-gray-900">{u.forceNo || "—"}</td>
                      <td className="px-4 py-2 text-sm text-gray-700">{u.rank || "—"}</td>
                      <td className="px-4 py-2 text-sm text-gray-700">{u.name || "—"}</td>
                      <td className="px-4 py-2 text-sm text-gray-700">{u.mobileNo || "—"}</td>
                      <td className="px-4 py-2 text-sm text-gray-700">{u.role || "Other"}</td>
                      <td className="px-4 py-2 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs ${u.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                          {u.active ? "Active" : "Inactive"}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan="6" className="px-4 py-6 text-center text-gray-500">No users found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      <AvailabilityOnDateModal
        open={openAvailability}
        onClose={() => setOpenAvailability(false)}
      />

      {/* Employee Modal */}
      <EmployeeModal
        employee={selectedUser}
        isOpen={showEmployeeModal}
        onClose={() => {
          setShowEmployeeModal(false);
          setSelectedUser(null);
        }}
        onSave={refreshUsers}
      />
    </div>
  );
}
