import { useState } from "react";
import Topbar from "../../components/Topbar.jsx";
import PageCard from "../../components/PageCard.jsx";
import { useNavigate } from "react-router-dom";

export default function WriterHome(){
  const [q, setQ] = useState("");
  const [range, setRange] = useState("Last 30 days");
  const nav = useNavigate();

  return (
    <div className="h-screen flex flex-col p-2">
      <div className="flex justify-between px-4">
      <h1 className="text-lg font-bold"> Writer-Home</h1>
      <Topbar query={q} setQuery={setQ} range={range} setRange={setRange}/>

      </div>
      <div className="px-8">
        <h1 className="text-xl text-center mt-5 font-semibold mb-6">Writer — choose an action</h1>
        <div className="flex gap-6">
          <PageCard title="Feed New User" onClick={()=>nav("/writer/new")} />
          <PageCard title="Look for any user" onClick={()=>nav("/writer/search")} />
          <PageCard title="Availability on Date" onClick={()=>nav("/writer/availability")} />
        </div>

        <div className="mt-auto fixed bottom-6 left-72">
          <label className="mr-2 text-sm bg-gray-200 px-3 py-2 rounded-sm">Import Excel/CSV</label>
          <input type="file" onChange={()=>nav("/writer/search?import=1")} />
        </div>
      </div>
    </div>
  );
}
