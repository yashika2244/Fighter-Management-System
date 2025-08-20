
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Topbar from "../../components/Topbar.jsx";
import PageCard from "../../components/PageCard.jsx";
import AvailabilityOnDateModal from "./AvailabilityOnDate.jsx";

export default function WriterHome() {
  const [q, setQ] = useState("");
  const [range, setRange] = useState("Last 30 days");
  const nav = useNavigate();
  const [openAvailability, setOpenAvailability] = useState(false);
  const [uploadMsg, setUploadMsg] = useState("");

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(
        import.meta.env.VITE_API_URL + "/upload/import",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
  setUploadMsg(`✅ ${res.data.message} (${res.data.imported} imported, ${res.data.skipped} skipped)`);

    } catch (err) {
      console.error(err);
      setUploadMsg(
        `❌ Upload failed: ${err.response?.data?.message || err.message}`
      );
    }
  };

  return (
    <div className="h-screen flex flex-col p-2">
      <div className="flex justify-between px-4">
        <h1 className="text-lg font-bold">Writer-Home</h1>
        <Topbar query={q} setQuery={setQ} range={range} setRange={setRange} />
      </div>

      <div className="px-8">
        <h1 className="text-xl text-center mt-5 font-semibold mb-6">
          Writer — choose an action
        </h1>
        <div className="flex gap-6">
          <PageCard title="Feed New User" onClick={() => nav("/writer/new")} />
          <PageCard title="Look for any user" onClick={() => nav("/writer/search")} />
          <PageCard
            title="Availability on Date"
            onClick={() => setOpenAvailability(true)}
          />
        </div>

        {/* Import CSV */}
        <div className="mt-auto fixed bottom-6 left-72">
          <label className="mr-2 text-sm bg-gray-200 px-3 py-2 rounded-sm cursor-pointer">
            Import Excel/CSV
            <input
              type="file"
              className="hidden"
              onChange={handleFileUpload}
              accept=".csv,.xlsx"
            />
          </label>
          {uploadMsg && <p className="text-sm mt-2">{uploadMsg}</p>}
        </div>
      </div>

      <AvailabilityOnDateModal
        open={openAvailability}
        onClose={() => setOpenAvailability(false)}
      />
    </div>
  );
}
