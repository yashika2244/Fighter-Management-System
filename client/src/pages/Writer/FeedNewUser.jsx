import { useState } from "react";
import { api } from "../../lib/axios";
import { useNavigate } from "react-router-dom";
import Topbar from "../../components/Topbar.jsx";
import {
  UserPlus,
  Calendar,
  ClipboardList,
  Banknote,
  Save,
  RotateCcw,
  ArrowLeft,
} from "lucide-react";

export default function FeedNewUser() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);

  const initialForm = {
    slNo: "",
    forceNo: "",
    rank: "",
    name: "",
    mobileNo: "",
    state: "",
    religion: "",
    caste: "",
    bg: "",
    homeAddress: "",
    height: "",
    dependent: "",
    nok: "",
    icardNo: "",
  };

  const [form, setForm] = useState(initialForm);
  const [datesForm, setDatesForm] = useState({});
  const [leaveForm, setLeaveForm] = useState({});
  const [bankForm, setBankForm] = useState({});
  const [msg, setMsg] = useState("");
  const [activeTab, setActiveTab] = useState("basic");

  // ---------- Update Functions ----------
  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const updateDates = (e) =>
    setDatesForm({ ...datesForm, [e.target.name]: e.target.value });
  const updateLeave = (e) =>
    setLeaveForm({ ...leaveForm, [e.target.name]: e.target.value });
  const updateBank = (e) =>
    setBankForm({ ...bankForm, [e.target.name]: e.target.value });

  // ---------- Submit Functions ----------
  const submit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/users", form);
      setUserId(data._id);
      setMsg(`✅ Saved: ${data.name} (${data.forceNo})`);
      setForm(initialForm);
    } catch {
      setMsg("❌ Error saving user!");
    }
  };
const submitDates = async (e) => {
  e.preventDefault();
  if (!userId) {
    setMsg("❌ Please save Basic details first!");
    return;
  }
  try {
    await api.put(`/users/${userId}`, datesForm);   // ✅ update same user
    setMsg("✅ Dates Saved!");
    setDatesForm({});
  } catch {
    setMsg("❌ Error saving dates!");
  }
};

 const submitLeave = async (e) => {
  e.preventDefault();
  try {
    await api.put(`/users/${userId}`, leaveForm);   // ✅ update same user
    setMsg("✅ Leave Saved!");
    setLeaveForm({});
  } catch {
    setMsg("❌ Error saving leave!");
  }
};
const submitBank = async (e) => {
  e.preventDefault();
  try {
    await api.put(`/users/${userId}`, bankForm);   // ✅ update same user
    setMsg("✅ Bank Saved!");
    setBankForm({});
  } catch {
    setMsg("❌ Error saving bank!");
  }
};
  // ---------- Utility ----------
  const clear = () => {
    if (activeTab === "basic") setForm(initialForm);
    if (activeTab === "dates") setDatesForm({});
    if (activeTab === "leave") setLeaveForm({});
    if (activeTab === "bank") setBankForm({});
  };
  const back = () => navigate(-1);

  // ---------- UI ----------
  return (
    // <div className="p-6 min-h-screen bg-gray-50">
    //   {/* Header */}
    //   <div className="flex justify-between items-center mb-6">
    //     <h2 className="text-2xl font-bold text-gray-700 flex items-center gap-2">
    //       <UserPlus className="text-blue-500" /> Feed New User
    //     </h2>
    //     <Topbar />
    //   </div>

    //   {/* Tabs */}
    //   <div className="flex gap-2 border-b border-gray-300 mb-3">
    //     {[
    //       { id: "basic", label: "Basic", icon: UserPlus },
    //       { id: "dates", label: "Dates", icon: Calendar },
    //       { id: "leave", label: "Leave/Records", icon: ClipboardList },
    //       { id: "bank", label: "Bank", icon: Banknote },
    //     ].map(({ id, label, icon: Icon }) => (
    //       <button
    //         key={id}
    //         onClick={() => setActiveTab(id)}
    //         className={`relative cursor-pointer flex items-center gap-2 px-6 py-2.5 text-sm font-semibold transition-all duration-300
    // ${
    //   activeTab === id ? "text-blue-600" : "text-gray-500 hover:text-gray-700"
    // }`}
    //       >
    //         <Icon size={18} />
    //         {label}

    //         {/* Active underline effect */}
    //         {activeTab === id && (
    //           <span className="absolute bottom-0 left-0 w-full h-[2px] bg-blue-600 rounded-t-md"></span>
    //         )}
    //       </button>
    //     ))}
    //   </div>

    //   {/* Form Wrapper */}
    //   <div className="bg-white border border-gray-200 shadow rounded-lg p-2 px-4 max-w-5xl">
    //     {/* Basic Tab */}
    //     {activeTab === "basic" && (
    //       <form onSubmit={submit} className="space-y-4">
    //         <div className="grid grid-cols-2 gap-2">
    //           {[
    //             ["SL NO", "slNo"],
    //             ["FORCE NO", "forceNo"],
    //             ["RANK", "rank"],
    //             ["NAME", "name"],
    //             ["MOBILE NO", "mobileNo"],
    //             ["STATE", "state"],
    //             ["RELIGION", "religion"],
    //             ["CASTE", "caste"],
    //             ["BG", "bg"],
    //             ["HOME ADDRESS", "homeAddress"],
    //             ["HEIGHT", "height"],
    //             ["DEPENDENT", "dependent"],
    //             ["NOK", "nok"],
    //             ["ICARD NO", "icardNo"],
    //           ].map(([label, name]) => (
    //             <div key={name}>
    //               <label className="block text-sm font-medium text-gray-600 mb-1">
    //                 {label}
    //               </label>
    //               <input
    //                 name={name}
    //                 value={form[name]}
    //                 onChange={update}
    //                 className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-blue-400 outline-none"
    //               />
    //             </div>
    //           ))}
    //         </div>

    //         {/* Buttons */}
    //         <div className="flex gap-3  ">
    //           <button
    //             type="submit"
    //             className="flex items-center gap-2 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
    //           >
    //             <Save size={16} /> Save
    //           </button>
    //           <button
    //             type="button"
    //             onClick={clear}
    //             className="flex items-center gap-2 px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
    //           >
    //             <RotateCcw size={16} /> Clear
    //           </button>
    //           <button
    //             type="button"
    //             onClick={back}
    //             className="flex items-center gap-2 px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
    //           >
    //             <ArrowLeft size={16} /> Back
    //           </button>
    //         </div>
    //       </form>
    //     )}

    //     {/* Dates Tab */}
    //     {activeTab === "dates" && (
    //       <form onSubmit={submitDates} className="grid grid-cols-2 gap-4">
    //         {[
    //           ["DOA COY", "doaCoy"],
    //           ["DOA UNIT", "doaUnit"],
    //           ["DOB", "dob"],
    //           ["DOE", "doe"],
    //           ["DOP", "dop"],
    //           ["JD PET 1ST", "jdPet1st"],
    //           ["JD PET 2ND", "jdPet2nd"],
    //         ].map(([label, name]) => (
    //           <div key={name}>
    //             <label className="block text-sm font-medium text-gray-600 mb-1">
    //               {label}
    //             </label>
    //             <input
    //               name={name}
    //               value={datesForm[name] || ""}
    //               onChange={updateDates}
    //               className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-blue-400 outline-none"
    //             />
    //           </div>
    //         ))}

    //         <div className="col-span-2 flex gap-3 pt-4 ">
    //           <button
    //             type="submit"
    //             className="flex items-center gap-2 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
    //           >
    //             <Save size={16} /> Save
    //           </button>
    //           <button
    //             type="button"
    //             onClick={clear}
    //             className="flex items-center gap-2 px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
    //           >
    //             <RotateCcw size={16} /> Clear
    //           </button>
    //           <button
    //             type="button"
    //             onClick={back}
    //             className="flex items-center gap-2 px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
    //           >
    //             <ArrowLeft size={16} /> Back
    //           </button>
    //         </div>
    //       </form>
    //     )}

    //     {/* Leave Tab */}
    //     {activeTab === "leave" && (
    //       <form onSubmit={submitLeave} className="grid grid-cols-2 gap-4">
    //         {[
    //           ["EL DUE", "elDue"],
    //           ["EL AVAILED", "elAvailed"],
    //           ["CL DUE", "clDue"],
    //           ["CL AVAILED", "clAvailed"],
    //           ["COURSE", "course"],
    //           ["EDN", "edn"],
    //           ["AME", "ame"],
    //           ["ARCF", "arcf"],
    //           ["LTC", "ltc"],
    //           ["PPPS", "ppps"],
    //           ["PLN", "pln"],
    //           ["SEC", "sec"],
    //           ["SPL DUTY", "splDuty"],
    //         ].map(([label, name]) => (
    //           <div key={name}>
    //             <label className="block text-sm font-medium text-gray-600 mb-1">
    //               {label}
    //             </label>
    //             <input
    //               name={name}
    //               value={leaveForm[name] || ""}
    //               onChange={updateLeave}
    //               className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-blue-400 outline-none"
    //             />
    //           </div>
    //         ))}

    //         <div className="col-span-2 flex gap-3 pt-4 ">
    //           <button
    //             type="submit"
    //             className="flex items-center gap-2 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
    //           >
    //             <Save size={16} /> Save
    //           </button>
    //           <button
    //             type="button"
    //             onClick={clear}
    //             className="flex items-center gap-2 px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
    //           >
    //             <RotateCcw size={16} /> Clear
    //           </button>
    //           <button
    //             type="button"
    //             onClick={back}
    //             className="flex items-center gap-2 px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
    //           >
    //             <ArrowLeft size={16} /> Back
    //           </button>
    //         </div>
    //       </form>
    //     )}

    //     {/* Bank Tab */}
    //     {activeTab === "bank" && (
    //       <form onSubmit={submitBank} className="grid grid-cols-2 gap-4">
    //         {[
    //           ["BANK ACCT", "bankAcct"],
    //           ["BR NAME", "brName"],
    //           ["IFSC CODE", "ifscCode"],
    //           ["MICR", "micr"],
    //         ].map(([label, name]) => (
    //           <div key={name}>
    //             <label className="block text-sm font-medium text-gray-600 mb-1">
    //               {label}
    //             </label>
    //             <input
    //               name={name}
    //               value={bankForm[name] || ""}
    //               onChange={updateBank}
    //               className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-blue-400 outline-none"
    //             />
    //           </div>
    //         ))}

    //         <div className="col-span-2 flex gap-3 pt-4">
    //           <button
    //             type="submit"
    //             className="flex items-center gap-2 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
    //           >
    //             <Save size={16} /> Save
    //           </button>
    //           <button
    //             type="button"
    //             onClick={clear}
    //             className="flex items-center gap-2 px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
    //           >
    //             <RotateCcw size={16} /> Clear
    //           </button>
    //           <button
    //             type="button"
    //             onClick={back}
    //             className="flex items-center gap-2 px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
    //           >
    //             <ArrowLeft size={16} /> Back
    //           </button>
    //         </div>
    //       </form>
    //     )}
    //   </div>

    //   {/* Message */}
    //   {msg && (
    //     <p className="mt-4 text-center font-medium text-green-600">{msg}</p>
    //   )}
    // </div>
    <div className="md:p-6  p-3 min-h-screen bg-gray-50">
  {/* Header */}
  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 md:mb-6">
    <h2 className="text-2xl font-bold text-gray-700 flex items-center gap-2">
      <UserPlus className="text-blue-500" /> Feed New User
    </h2>
    <Topbar />
  </div>

  {/* Tabs */}
  <div className="flex flex-wrap gap-2 border-b border-gray-300 mb-3">
    {[
      { id: "basic", label: "Basic", icon: UserPlus },
      { id: "dates", label: "Dates", icon: Calendar },
      { id: "leave", label: "Leave/Records", icon: ClipboardList },
      { id: "bank", label: "Bank", icon: Banknote },
    ].map(({ id, label, icon: Icon }) => (
      <button
        key={id}
        onClick={() => setActiveTab(id)}
        className={`relative cursor-pointer flex items-center gap-2 px-4 sm:px-6 py-2 text-sm font-semibold transition-all duration-300
          ${
            activeTab === id
              ? "text-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
      >
        <Icon size={18} />
        {label}

        {/* Active underline */}
        {activeTab === id && (
          <span className="absolute bottom-0 left-0 w-full h-[2px] bg-blue-600 rounded-t-md"></span>
        )}
      </button>
    ))}
  </div>

  {/* Form Wrapper */}
  <div className="bg-white border border-gray-200 shadow rounded-lg p-4 sm:p-6 max-w-5xl mx-auto">
    {/* Basic Tab */}
    {activeTab === "basic" && (
      <form onSubmit={submit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            ["SL NO", "slNo"],
            ["FORCE NO", "forceNo"],
            ["RANK", "rank"],
            ["NAME", "name"],
            ["MOBILE NO", "mobileNo"],
            ["STATE", "state"],
            ["RELIGION", "religion"],
            ["CASTE", "caste"],
            ["BG", "bg"],
            ["HOME ADDRESS", "homeAddress"],
            ["HEIGHT", "height"],
            ["DEPENDENT", "dependent"],
            ["NOK", "nok"],
            ["ICARD NO", "icardNo"],
          ].map(([label, name]) => (
            <div key={name}>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                {label}
              </label>
              <input
                name={name}
                value={form[name]}
                onChange={update}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap gap-3 pt-2">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            <Save size={16} /> Save
          </button>
          <button
            type="button"
            onClick={clear}
            className="flex items-center gap-2 px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
          >
            <RotateCcw size={16} /> Clear
          </button>
          <button
            type="button"
            onClick={back}
            className="flex items-center gap-2 px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
          >
            <ArrowLeft size={16} /> Back
          </button>
        </div>
      </form>
    )}

    {/* Dates Tab */}
    {activeTab === "dates" && (
      <form onSubmit={submitDates} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          ["DOA COY", "doaCoy"],
          ["DOA UNIT", "doaUnit"],
          ["DOB", "dob"],
          ["DOE", "doe"],
          ["DOP", "dop"],
          ["JD PET 1ST", "jdPet1st"],
          ["JD PET 2ND", "jdPet2nd"],
        ].map(([label, name]) => (
          <div key={name}>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              {label}
            </label>
            <input
              name={name}
              value={datesForm[name] || ""}
              onChange={updateDates}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>
        ))}

        <div className="col-span-1 md:col-span-2 flex flex-wrap gap-3 pt-4">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            <Save size={16} /> Save
          </button>
          <button
            type="button"
            onClick={clear}
            className="flex items-center gap-2 px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
          >
            <RotateCcw size={16} /> Clear
          </button>
          <button
            type="button"
            onClick={back}
            className="flex items-center gap-2 px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
          >
            <ArrowLeft size={16} /> Back
          </button>
        </div>
      </form>
    )}

    {/* Leave Tab */}
    {activeTab === "leave" && (
      <form onSubmit={submitLeave} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          ["EL DUE", "elDue"],
          ["EL AVAILED", "elAvailed"],
          ["CL DUE", "clDue"],
          ["CL AVAILED", "clAvailed"],
          ["COURSE", "course"],
          ["EDN", "edn"],
          ["AME", "ame"],
          ["ARCF", "arcf"],
          ["LTC", "ltc"],
          ["PPPS", "ppps"],
          ["PLN", "pln"],
          ["SEC", "sec"],
          ["SPL DUTY", "splDuty"],
        ].map(([label, name]) => (
          <div key={name}>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              {label}
            </label>
            <input
              name={name}
              value={leaveForm[name] || ""}
              onChange={updateLeave}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>
        ))}

        <div className="col-span-1 md:col-span-2 flex flex-wrap gap-3 pt-4">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            <Save size={16} /> Save
          </button>
          <button
            type="button"
            onClick={clear}
            className="flex items-center gap-2 px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
          >
            <RotateCcw size={16} /> Clear
          </button>
          <button
            type="button"
            onClick={back}
            className="flex items-center gap-2 px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
          >
            <ArrowLeft size={16} /> Back
          </button>
        </div>
      </form>
    )}

    {/* Bank Tab */}
    {activeTab === "bank" && (
      <form onSubmit={submitBank} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          ["BANK ACCT", "bankAcct"],
          ["BR NAME", "brName"],
          ["IFSC CODE", "ifscCode"],
          ["MICR", "micr"],
        ].map(([label, name]) => (
          <div key={name}>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              {label}
            </label>
            <input
              name={name}
              value={bankForm[name] || ""}
              onChange={updateBank}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>
        ))}

        <div className="col-span-1 md:col-span-2 flex flex-wrap gap-3 pt-4">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            <Save size={16} /> Save
          </button>
          <button
            type="button"
            onClick={clear}
            className="flex items-center gap-2 px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
          >
            <RotateCcw size={16} /> Clear
          </button>
          <button
            type="button"
            onClick={back}
            className="flex items-center gap-2 px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
          >
            <ArrowLeft size={16} /> Back
          </button>
        </div>
      </form>
    )}
  </div>

  {/* Message */}
  {msg && (
    <p className="mt-4 text-center font-medium text-green-600">{msg}</p>
  )}
</div>

  );
}


// import { useState } from "react";
// import { api } from "../../lib/axios";
// import { useNavigate } from "react-router-dom";
// import Topbar from "../../components/Topbar.jsx";
// import {
//   UserPlus,
//   Calendar,
//   ClipboardList,
//   Banknote,
//   Save,
//   RotateCcw,
//   ArrowLeft,
// } from "lucide-react";

// export default function FeedNewUser() {
//   const navigate = useNavigate();
//   const [msg, setMsg] = useState("");
//   const [activeTab, setActiveTab] = useState("basic");

//   const initialForm = {
//     // Basic
//     slNo: "",
//     forceNo: "",
//     rank: "",
//     name: "",
//     mobileNo: "",
//     dob: "",
//     doe: "",
//     doaCoy: "",
//     doaUnit: "",
//     dop: "",
//     dod: "",
//     religion: "",
//     caste: "",
//     course: "",
//     education: "",
//     bg: "",
//     height: "",
//     state: "",
//     homeAddress: "",
//     // Leave
//     elTotal: 60,
//     elUsed: 0,
//     clTotal: 15,
//     clUsed: 0,
//     jdpet1st: "",
//     jdpet2st: "",
//     ame: "",
//     arcf: "",
//     ltc: "",
//     // Bank
//     bankac: "",
//     branchNo: "",
//     ifsc: "",
//     micr: "",
//     // Other
//     nok: "",
//     dependent: "",
//     icardNo: "",
//     ppps: "",
//     pln: "",
//     sec: "",
//     specialDuty: false,
//     // Store userId after creation
//     _id: null,
//   };

//   const [form, setForm] = useState(initialForm);

//   // ---------- Update Function ----------
//   const update = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   // ---------- Submit Function ----------
//   const submitTab = async (e) => {
//     e.preventDefault();
//     try {
//       if (form._id) {
//         // Update existing user
//         const { data } = await api.put(`/users/${form._id}`, form);
//         setForm({ ...form, _id: data._id });
//         setMsg(`✅ Updated: ${data.name}`);
//       } else {
//         // Create new user
//         const { data } = await api.post("/users", form);
//         setForm({ ...form, _id: data._id });
//         setMsg(`✅ Saved: ${data.name}`);
//       }
//     } catch (err) {
//       console.error(err);
//       setMsg("❌ Error saving user!");
//     }
//   };

//   // ---------- Clear Function ----------
//   const clear = () => {
//     if (activeTab === "basic") {
//       setForm({
//         ...form,
//         slNo: "",
//         forceNo: "",
//         rank: "",
//         name: "",
//         mobileNo: "",
//         dob: "",
//         doe: "",
//         doaCoy: "",
//         doaUnit: "",
//         dop: "",
//         dod: "",
//         religion: "",
//         caste: "",
//         course: "",
//         education: "",
//         bg: "",
//         height: "",
//         state: "",
//         homeAddress: "",
//       });
//     }
//     if (activeTab === "dates") {
//       setForm({
//         ...form,
//         dob: "",
//         doe: "",
//         doaCoy: "",
//         doaUnit: "",
//         dop: "",
//         dod: "",
//         jdpet1st: "",
//         jdpet2st: "",
//       });
//     }
//     if (activeTab === "leave") {
//       setForm({
//         ...form,
//         elTotal: 60,
//         elUsed: 0,
//         clTotal: 15,
//         clUsed: 0,
//         course: "",
//         education: "",
//         ame: "",
//         arcf: "",
//         ltc: "",
//         ppps: "",
//         pln: "",
//         sec: "",
//         specialDuty: false,
//       });
//     }
//     if (activeTab === "bank") {
//       setForm({
//         ...form,
//         bankac: "",
//         branchNo: "",
//         ifsc: "",
//         micr: "",
//         nok: "",
//         dependent: "",
//         icardNo: "",
//       });
//     }
//   };

//   const back = () => navigate(-1);

//   // ---------- UI ----------
//   return (
//     <div className="p-6 min-h-screen bg-gray-50">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-2xl font-bold text-gray-700 flex items-center gap-2">
//           <UserPlus className="text-blue-500" /> Feed New User
//         </h2>
//         <Topbar />
//       </div>

//       {/* Tabs */}
//       <div className="flex gap-2 border-b border-gray-300 mb-3">
//         {[
//           { id: "basic", label: "Basic", icon: UserPlus },
//           { id: "dates", label: "Dates", icon: Calendar },
//           { id: "leave", label: "Leave/Records", icon: ClipboardList },
//           { id: "bank", label: "Bank", icon: Banknote },
//         ].map(({ id, label, icon: Icon }) => (
//           <button
//             key={id}
//             onClick={() => setActiveTab(id)}
//             className={`relative cursor-pointer flex items-center gap-2 px-6 py-2.5 text-sm font-semibold transition-all duration-300
//     ${
//       activeTab === id ? "text-blue-600" : "text-gray-500 hover:text-gray-700"
//     }`}
//           >
//             <Icon size={18} />
//             {label}

//             {activeTab === id && (
//               <span className="absolute bottom-0 left-0 w-full h-[2px] bg-blue-600 rounded-t-md"></span>
//             )}
//           </button>
//         ))}
//       </div>

//       {/* Form Wrapper */}
//       <div className="bg-white border border-gray-200 shadow rounded-lg p-2 px-4 max-w-5xl">
//         {/* Dynamic Form */}
//         <form onSubmit={submitTab} className="grid grid-cols-2 gap-4">
//           {activeTab === "basic" &&
//             [
//               ["SL NO", "slNo"],
//               ["FORCE NO", "forceNo"],
//               ["RANK", "rank"],
//               ["NAME", "name"],
//               ["MOBILE NO", "mobileNo"],
//               ["STATE", "state"],
//               ["RELIGION", "religion"],
//               ["CASTE", "caste"],
//               ["BG", "bg"],
//               ["HOME ADDRESS", "homeAddress"],
//               ["HEIGHT", "height"],
//               ["DEPENDENT", "dependent"],
//               ["NOK", "nok"],
//               ["ICARD NO", "icardNo"],
//             ].map(([label, name]) => (
//               <div key={name}>
//                 <label className="block text-sm font-medium text-gray-600 mb-1">
//                   {label}
//                 </label>
//                 <input
//                   name={name}
//                   value={form[name]}
//                   onChange={update}
//                   className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-blue-400 outline-none"
//                 />
//               </div>
//             ))}

//           {activeTab === "dates" &&
//             [
//               ["DOA COY", "doaCoy"],
//               ["DOA UNIT", "doaUnit"],
//               ["DOB", "dob"],
//               ["DOE", "doe"],
//               ["DOP", "dop"],
//               ["JD PET 1ST", "jdpet1st"],
//               ["JD PET 2ND", "jdpet2st"],
//             ].map(([label, name]) => (
//               <div key={name}>
//                 <label className="block text-sm font-medium text-gray-600 mb-1">
//                   {label}
//                 </label>
//                 <input
//                   name={name}
//                   value={form[name]}
//                   onChange={update}
//                   className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-blue-400 outline-none"
//                 />
//               </div>
//             ))}

//           {activeTab === "leave" &&
//             [
//               ["EL DUE", "elTotal"],
//               ["EL AVAILED", "elUsed"],
//               ["CL DUE", "clTotal"],
//               ["CL AVAILED", "clUsed"],
//               ["COURSE", "course"],
//               ["EDN", "education"],
//               ["AME", "ame"],
//               ["ARCF", "arcf"],
//               ["LTC", "ltc"],
//               ["PPPS", "ppps"],
//               ["PLN", "pln"],
//               ["SEC", "sec"],
//               ["SPL DUTY", "specialDuty"],
//             ].map(([label, name]) => (
//               <div key={name}>
//                 <label className="block text-sm font-medium text-gray-600 mb-1">
//                   {label}
//                 </label>
//                 <input
//                   name={name}
//                   value={form[name] || ""}
//                   onChange={update}
//                   className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-blue-400 outline-none"
//                   type={name === "specialDuty" ? "checkbox" : "text"}
//                 />
//               </div>
//             ))}

//           {activeTab === "bank" &&
//             [
//               ["BANK ACCT", "bankac"],
//               ["BR NAME", "branchNo"],
//               ["IFSC CODE", "ifsc"],
//               ["MICR", "micr"],
//               ["NOK", "nok"],
//               ["DEPENDENT", "dependent"],
//               ["ICARD NO", "icardNo"],
//             ].map(([label, name]) => (
//               <div key={name}>
//                 <label className="block text-sm font-medium text-gray-600 mb-1">
//                   {label}
//                 </label>
//                 <input
//                   name={name}
//                   value={form[name] || ""}
//                   onChange={update}
//                   className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-blue-400 outline-none"
//                 />
//               </div>
//             ))}

//           <div className="col-span-2 flex gap-3 pt-4">
//             <button
//               type="submit"
//               className="flex items-center gap-2 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
//             >
//               <Save size={16} /> Save
//             </button>
//             <button
//               type="button"
//               onClick={clear}
//               className="flex items-center gap-2 px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
//             >
//               <RotateCcw size={16} /> Clear
//             </button>
//             <button
//               type="button"
//               onClick={back}
//               className="flex items-center gap-2 px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
//             >
//               <ArrowLeft size={16} /> Back
//             </button>
//           </div>
//         </form>
//       </div>

//       {/* Message */}
//       {msg && (
//         <p className="mt-4 text-center font-medium text-green-600">{msg}</p>
//       )}
//     </div>
//   );
// }
