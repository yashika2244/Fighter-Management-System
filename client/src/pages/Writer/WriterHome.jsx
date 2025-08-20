
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

  return (
    <div className="min-h-screen flex flex-col p-2 sm:p-4 py-20 md:py-0">
      {/* Header */}
      <div className="md:flex  flex-col sm:flex-row justify-between  hidden items-start sm:items-center px-4 mb-6">
        <h1 className="text-lg sm:text-xl font-bold mb-2 sm:mb-0">Writer-Home</h1>
        <Topbar query={q} setQuery={setQ} range={range} setRange={setRange} />
      </div>

      {/* Action Section */}
      <div className="px-4 sm:px-8 flex-1 flex flex-col">
        <h1 className="text-xl text-center mt-5 font-semibold mb-6">
          Writer — choose an action
        </h1>
        
        {/* Cards: stack on small screens, row on large */}
        <div className="flex flex-col sm:flex-row sm:gap-6 gap-4 items-center sm:items-start flex-wrap justify-center">
          <PageCard title="Feed New User" onClick={() => nav("/writer/new")} />
          <PageCard title="Look for any user" onClick={() => nav("/writer/search")} />
          <PageCard
            title="Availability on Date"
            onClick={() => setOpenAvailability(true)}
          />
        </div>

        {/* Import CSV */}
        <div className="mt-8 sm:mt-auto sm:fixed mx-auto sm:bottom-6 sm:left-72 flex flex-col sm:flex-row items-start sm:items-center gap-2">
          <label className="text-sm bg-gray-200 px-3 py-2 rounded-sm cursor-pointer">
            Import Excel/CSV
            <input
              type="file"
              className="hidden"
              onChange={handleFileUpload}
              accept=".csv,.xlsx"
            />
          </label>
          {uploadMsg && <p className="text-sm mt-2 sm:mt-0">{uploadMsg}</p>}
        </div>
      </div>

      <AvailabilityOnDateModal
        open={openAvailability}
        onClose={() => setOpenAvailability(false)}
      />
    </div>
  );
}
