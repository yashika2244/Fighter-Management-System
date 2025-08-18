import { useState } from "react";
import { api } from "../../lib/axios";

export default function AvailabilityOnDate(){
  const [date, setDate] = useState(()=>new Date().toISOString().slice(0,10));
  const [rows, setRows] = useState([]);

  const load = async ()=>{
    const { data } = await api.get("/availability/on-date", { params: { date }});
    setRows(data);
  };

  return (
    <div className="p-8">
      <h2 className="text-lg font-semibold mb-4">Availability on Date</h2>
      <div className="flex gap-3 mb-4">
        <input type="date" className="border rounded px-3 py-2" value={date} onChange={e=>setDate(e.target.value)}/>
        <button onClick={load} className="bg-gray-900 text-white px-4 py-2 rounded">Load</button>
      </div>
      <table className="w-full text-sm border">
        <thead className="bg-gray-50">
          <tr>
            <th className="p-2 border">Service No</th>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Note</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(r=>(
            <tr key={r._id}>
              <td className="p-2 border">{r.user?.serviceNo}</td>
              <td className="p-2 border">{r.user?.name}</td>
              <td className="p-2 border">{r.status}</td>
              <td className="p-2 border">{r.note}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
