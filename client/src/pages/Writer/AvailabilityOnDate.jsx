

import { useState, useEffect } from "react";
import { api } from "../../lib/axios";
import {
  X,
  Calendar,
  Users,
  UserCheck,
  UserX,
  ClipboardList,
} from "lucide-react";

export default function AvailabilityOnDateModal({ open, onClose }) {
  const [selectedRow, setSelectedRow] = useState(null);
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [summary, setSummary] = useState({
    total: 0,
    onEL: 0,
    onCL: 0,
    onLeave: 0,
    available: 0,
    onDuty: 0,
    restricted: 0,
  });
  const [onLeave, setOnLeave] = useState([]);
  const [available, setAvailable] = useState([]);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const load = async () => {
    try {
      const formattedDate = new Date(date).toISOString().slice(0, 10); // "YYYY-MM-DD"
      const res = await api.get("/availability/on-date", {
        params: { date: formattedDate },
      });
      console.log("Requesting date:", formattedDate);
      console.log("API Response:", res.data);
      setSummary(
        res.data.summary || {
          total: 0,
          onEL: 0,
          onCL: 0,
          onLeave: 0,
          onDuty: 0,
          restricted: 0,
          available: 0,
        }
      );
      setOnLeave(res.data.onLeave || []);
      setAvailable(res.data.available || []);
    } catch (err) {
      console.error("API load error:", err);
    }
  };

  useEffect(() => {
    if (open) {
      load();
    }
  }, [open, date]);

  if (!open) return null;

  return (
    // <div className="fixed inset-0 bg-black/10 backdrop-blur-md flex items-center justify-center z-50">
    //   <div className="bg-white rounded-xl shadow-2xl w-[95%] max-w-6xl h-[92%] flex flex-col overflow-hidden border border-gray-200">
    //     {/* Header */}
    //     <div className="flex justify-between items-center px-6 py-4  bg-gray-300 text-black">
    //       <h2 className="text-lg font-semibold flex items-center gap-2">
    //         <Users size={20} />
    //         Availability on Date
    //       </h2>
    //       <div className="flex items-center gap-5">
    //         <span className="text-xs opacity-80 font-mono">
    //           {now.toISOString().slice(0, 19).replace("T", " ")}
    //         </span>
    //         <button
    //           onClick={onClose}
    //           className="p-2 rounded-full hover:bg-white/20 transition"
    //         >
    //           <X size={18} />
    //         </button>
    //       </div>
    //     </div>

    //     {/* Body */}
    //     <div className="p-6 flex-1 flex flex-col gap-6  bg-gray-50">
    //       {/* Date & Check */}
    //       <div className="flex items-center gap-3">
    //         <label className="text-sm font-medium flex items-center gap-2 text-gray-700">
    //           <Calendar size={16} className="text-cyan-600 " />
    //           Select Date :
    //         </label>
    //         <input
    //           type="date"
    //           className="border border-gray-300 cursor-pointer rounded-lg px-3 py-1 text-sm shadow-sm focus:ring-1 focus:ring-cyan-500 focus:outline-none"
    //           value={date}
    //           onChange={(e) => setDate(e.target.value)}
    //         />
    //         <button
    //           onClick={load}
    //           className="bg-cyan-600 text-white px-6 py-2 rounded-lg text-sm font-medium shadow hover:shadow-md hover:bg-cyan-700  cursor-pointer transition"
    //         >
    //           Check
    //         </button>
    //       </div>

    //       {/* Summary */}
    //       <div className="grid grid-cols-7 gap-4">
    //         {[
    //           {
    //             label: "Total",
    //             value: summary.total,
    //             icon: ClipboardList,
    //             color: "text-blue-600",
    //           },
    //           {
    //             label: "On EL",
    //             value: summary.onEL,
    //             icon: UserX,
    //             color: "text-red-500",
    //           },
    //           {
    //             label: "On CL",
    //             value: summary.onCL,
    //             icon: UserX,
    //             color: "text-orange-500",
    //           },
    //           {
    //             label: "On Leave",
    //             value: summary.onLeave,
    //             icon: UserX,
    //             color: "text-pink-600",
    //           },
    //           {
    //             label: "On Duty",
    //             value: summary.onDuty,
    //             icon: Users,
    //             color: "text-indigo-600",
    //           },
    //           {
    //             label: "Restricted",
    //             value: summary.restricted,
    //             icon: Users,
    //             color: "text-yellow-500",
    //           },
    //           {
    //             label: "Available",
    //             value: summary.available,
    //             icon: UserCheck,
    //             color: "text-green-600",
    //           },
    //         ].map((item, i) => (
    //           <div
    //             key={i}
    //             className="p-4 bg-white border border-gray-300 rounded-md shadow-sm hover:shadow-md transition flex items-center gap-3"
    //           >
    //             <div className={`p-2 rounded-full bg-gray-100 ${item.color}`}>
    //               <item.icon size={18} />
    //             </div>
    //             <div>
    //               <p className="text-xs text-gray-500">{item.label}</p>
    //               <p className="text-xl font-semibold text-gray-800">
    //                 {item.value}
    //               </p>
    //             </div>
    //           </div>
    //         ))}
    //       </div>

    //       {/* Tables */}
    //       <div className="grid grid-cols-2 gap-6 flex-1">
    //         {/* On Leave */}
    //         <div className="flex flex-col border border-gray-300 rounded-xl shadow-sm overflow-hidden bg-white">
    //           <div className="px-4 py-3 bg-gray-100 text-sm font-semibold border-b  border-gray-300 sticky top-0 z-10">
    //             On Leave
    //           </div>
    //           <div className="flex-1 overflow-auto">
    //             <table className="w-full text-sm">
    //               <thead className="bg-gray-50 border-b border-gray-300 sticky top-0">
    //                 <tr>
    //                   <th className="px-4 py-2 text-left">Force No</th>
    //                   <th className="px-4 py-2 text-left">Rank</th>
    //                   <th className="px-4 py-2 text-left">Name</th>
    //                   <th className="px-4 py-2 text-left">Type</th>
    //                 </tr>
    //               </thead>
    //               <tbody>
    //                 {onLeave.length > 0 ? (
    //                   <>
    //                     {onLeave.map((r, i) => (
    //                       <tr
    //                         key={i}
    //                         className="border-b border-gray-300 hover:bg-gray-50 odd:bg-gray-50/50"
    //                       >
    //                         <td className="px-4 py-2">{r.forceNo}</td>
    //                         <td className="px-4 py-2">{r.rank}</td>
    //                         <td className="px-4 py-2">{r.name}</td>
    //                         <td className="px-4 py-2">{r.type}</td>
    //                       </tr>
    //                     ))}
    //                     {/* Total Leave Row */}
    //                     <tr className="bg-gray-100 font-semibold">
    //                       <td colSpan={3} className="px-4 py-2 text-right">
    //                         Total Leave
    //                       </td>
    //                       <td className="px-4 py-2">{onLeave.length}</td>
    //                     </tr>
    //                   </>
    //                 ) : (
    //                   <tr>
    //                     <td
    //                       className="px-4 py-6 text-center text-gray-500"
    //                       colSpan={4}
    //                     >
    //                       No records
    //                     </td>
    //                   </tr>
    //                 )}
    //               </tbody>
    //             </table>
    //           </div>
    //         </div>

    //         {/* Available */}
    //         <div className="flex flex-col border border-gray-300 rounded-xl shadow-sm bg-white">
    //           <div className="px-4 py-3 bg-gray-100 text-sm font-semibold border-b border-gray-300 sticky top-0 z-10">
    //             Available
    //           </div>
    //           <div className="max-h-64 overflow-y-auto">
    //             <table className="w-full text-sm">
    //               <thead className="bg-gray-50 border-b border-gray-300 sticky top-0">
    //                 <tr>
    //                   <th className="px-4 py-2 text-left">Force No</th>
    //                   <th className="px-4 py-2 text-left">Rank</th>
    //                 </tr>
    //               </thead>
    //               <tbody>
    //                 {available.length > 0 ? (
    //                   available.map((r, i) => {
    //                     const isSelected = selectedRow === i; // check if current row is selected
    //                     return (
    //                       <tr
    //                         key={i}
    //                         className={`border-b border-gray-100  cursor-pointer ${
    //                           isSelected ? "bg-gray-100" : ""
    //                         }`}
    //                         onClick={() => setSelectedRow(i)}
    //                       >
    //                         <td className="px-4 py-2">{r.forceNo}</td>
    //                         <td className="px-4 py-2">{r.rank}</td>
    //                       </tr>
    //                     );
    //                   })
    //                 ) : (
    //                   <tr>
    //                     <td
    //                       className="px-4 py-6 text-center text-gray-500"
    //                       colSpan={2}
    //                     >
    //                       No records
    //                     </td>
    //                   </tr>
    //                 )}
    //               </tbody>
    //             </table>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </div>
  
<div className="fixed inset-0 bg-black/10 backdrop-blur-md flex items-center justify-center z-50">
  <div className="bg-white rounded-xl shadow-2xl w-[95%] max-w-6xl h-[92%] flex flex-col overflow-hidden border border-gray-200">
    
    {/* Header */}
    <div className="flex justify-between items-center px-6 py-4 bg-gray-300 text-black">
      <h2 className="text-lg font-semibold flex items-center gap-2">
        <Users size={20} />
        Availability on Date
      </h2>
      <div className="flex items-center gap-5">
        <span className="text-xs opacity-80 font-mono">
          {now.toISOString().slice(0, 19).replace("T", " ")}
        </span>
        <button
          onClick={onClose}
          className="p-2 rounded-full hover:bg-white/20 transition"
        >
          <X size={18} />
        </button>
      </div>
    </div>

    {/* Body */}
    <div className="p-6 flex-1 flex flex-col gap-6 bg-gray-50">
      
      {/* Date & Check */}
      <div className="flex flex-wrap items-center gap-3">
        <label className="text-sm font-medium flex items-center gap-2 text-gray-700">
          <Calendar size={16} className="text-cyan-600 " />
          Select Date :
        </label>
        <input
          type="date"
          className="border border-gray-300 cursor-pointer rounded-lg px-3 py-1 text-sm shadow-sm focus:ring-1 focus:ring-cyan-500 focus:outline-none"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <button
          onClick={load}
          className="bg-cyan-600 text-white px-6 py-2 rounded-lg text-sm font-medium shadow hover:shadow-md hover:bg-cyan-700 cursor-pointer transition"
        >
          Check
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4">
        {[
          { label: "Total", value: summary.total, icon: ClipboardList, color: "text-blue-600" },
          { label: "On EL", value: summary.onEL, icon: UserX, color: "text-red-500" },
          { label: "On CL", value: summary.onCL, icon: UserX, color: "text-orange-500" },
          { label: "On Leave", value: summary.onLeave, icon: UserX, color: "text-pink-600" },
          // { label: "On Duty", value: summary.onDuty, icon: Users, color: "text-indigo-600" },
          // { label: "Restricted", value: summary.restricted, icon: Users, color: "text-yellow-500" },
          { label: "Available", value: summary.available, icon: UserCheck, color: "text-green-600" },
        ].map((item, i) => (
          <div
            key={i}
            className="p-4 bg-white border border-gray-300 rounded-md shadow-sm hover:shadow-md transition flex items-center gap-3"
          >
            <div className={`p-2 rounded-full bg-gray-100 ${item.color}`}>
              <item.icon size={18} />
            </div>
            <div>
              <p className="text-xs text-gray-500">{item.label}</p>
              <p className="text-xl font-semibold text-gray-800">{item.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1">
        
        {/* On Leave */}
        <div className="flex flex-col border border-gray-300 rounded-xl shadow-sm bg-white">
          <div className="px-4 py-3 bg-gray-100 text-sm font-semibold border-b border-gray-300 sticky top-0 z-10">
            On Leave
          </div>
          <div className="flex-1 overflow-x-auto">
            <table className="min-w-[500px] w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-300 sticky top-0">
                <tr>
                  <th className="px-4 py-2 text-left">Force No</th>
                  <th className="px-4 py-2 text-left">Rank</th>
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Type</th>
                </tr>
              </thead>
              <tbody>
                {onLeave.length > 0 ? (
                  <>
                    {onLeave.map((r, i) => (
                      <tr key={i} className="border-b border-gray-300 hover:bg-gray-50 odd:bg-gray-50/50">
                        <td className="px-4 py-2">{r.forceNo}</td>
                        <td className="px-4 py-2">{r.rank}</td>
                        <td className="px-4 py-2">{r.name}</td>
                        <td className="px-4 py-2">{r.type}</td>
                      </tr>
                    ))}
                    
                  </>
                ) : (
                  <tr>
                    <td colSpan={4} className="px-4 py-6 text-center text-gray-500">No records</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Available */}
        <div className="flex flex-col border border-gray-300 rounded-xl shadow-sm bg-white">
          <div className="px-4 py-3 bg-gray-100 text-sm font-semibold border-b border-gray-300 sticky top-0 z-10">
            Available
          </div>
          <div className="max-h-64 overflow-y-auto overflow-x-auto">
            <table className="min-w-[300px] w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-300 sticky top-0">
                <tr>
                  <th className="px-4 py-2 text-left">Force No</th>
                  <th className="px-4 py-2 text-left">Rank</th>
                </tr>
              </thead>
              <tbody>
                {available.length > 0 ? (
                  available.map((r, i) => (
                    <tr
                      key={i}
                      className={`border-b border-gray-100 cursor-pointer ${selectedRow === i ? "bg-gray-100" : ""}`}
                      onClick={() => setSelectedRow(i)}
                    >
                      <td className="px-4 py-2">{r.forceNo}</td>
                      <td className="px-4 py-2">{r.rank}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={2} className="px-4 py-6 text-center text-gray-500">No records</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  </div>
</div>


  );
}
