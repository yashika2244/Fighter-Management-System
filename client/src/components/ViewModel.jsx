import { useEffect, useState } from "react";
import {
  User,
  Calendar,
  Award,
  Phone,
  Mail,
  MapPin,
  HeartPulse,
  Briefcase,
} from "lucide-react";

export default function ViewModel({ open, onClose, user }) {
  const [form, setForm] = useState(user || {});
  const [activeTab, setActiveTab] = useState("Identity");

  useEffect(() => {
    setForm(user || {});
  }, [user]);

  if (!open) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const tabs = [
    "Identity",
    "Contact",
    "Background",
    "Medical",
    "Address",
    "Leave",
    "Service",
    "Finance",
    "Other",
    "Readiness",
  ];

  return (
    <div className="fixed inset-0 bg-transparent/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white w-[950px] max-h-[90vh] rounded-lg shadow-2xl overflow-hidden flex flex-col border border-gray-200">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-2 bg-gray-100 sticky top-0 z-10">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600" />
            View / Edit Personnel
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-600 text-2xl font-bold transition"
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 px-1 text-sm font-medium  mt-2 overflow-x-auto sticky top-[61px] z-10">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1 border border-gray-300 cursor-pointer last:border-none transition whitespace-nowrap 
              rounded-2xl  ${
                activeTab === tab
                  ? "bg-white text-blue-600 font-semibold "
                  : "text-gray-600 hover:bg-gray-200 bg-gray-100 "
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50/30">
          {/* ------------------ Identity ------------------ */}
          {activeTab === "Identity" && (
            <div className="grid grid-cols-2 gap-6">
              <Field
                label="Force No"
                name="forceNo"
                required
                value={form.forceNo}
                onChange={handleChange}
              />
              <Select
                label="Rank"
                name="rank"
                required
                value={form.rank}
                onChange={handleChange}
                options={["Constable", "Head Constable", "Sub-Inspector"]}
              />
              <Field
                label="Name"
                name="name"
                required
                value={form.name}
                onChange={handleChange}
              />
              <DateField
                label="Date of Birth"
                name="dob"
                value={form.dob}
                onChange={handleChange}
                icon={<Calendar className="w-4 h-4 text-gray-500" />}
              />
              <DateField
                label="DOE (Date of Enlistment)"
                name="doe"
                value={form.doe}
                onChange={handleChange}
              />
              <DateField
                label="DOA Coy"
                name="doaCoy"
                value={form.doaCoy}
                onChange={handleChange}
              />
              <DateField
                label="DOA Unit"
                name="doaUnit"
                value={form.doaUnit}
                onChange={handleChange}
              />
              <DateField
                label="DOP (Date of Promotion)"
                name="dop"
                value={form.dop}
                onChange={handleChange}
                icon={<Award className="w-4 h-4 text-gray-500" />}
              />
            </div>
          )}

          {/* ------------------ Contact ------------------ */}
          {activeTab === "Contact" && (
            <div className="h-[335px] overflow-y-auto p-4 bg-gray-50 rounded">
              <Field
                label="Mobile Number"
                name="mobile"
                value={form.mobile}
                onChange={handleChange}
                icon={<Phone className="w-4 h-4 text-gray-500" />}
              />
            </div>
          )}

          {/* ------------------ Background ------------------ */}
          {activeTab === "Background" && (
            <div className="h-[335px]">

            <div className="grid grid-cols-2 gap-6 ">
              <Field
                label="Religion"
                name="religion"
                value={form.religion}
                onChange={handleChange}
              />
              <Field
                label="Education"
                name="education"
                value={form.education}
                onChange={handleChange}
              />
              <Field
                label="Caste"
                name="caste"
                value={form.caste}
                onChange={handleChange}
              />
              <Field
                label="Course"
                name="course"
                value={form.course}
                onChange={handleChange}
              />
            </div>
            </div>
          )}

          {/* ------------------ Medical ------------------ */}
          {activeTab === "Medical" && (
            <div className="h-[335px]">

            <div className="grid grid-cols-2 gap-6">
              <Field
                label="Blood Group"
                name="bloodGroup"
                value={form.bloodGroup}
                onChange={handleChange}
                icon={<HeartPulse className="w-4 h-4 text-red-500" />}
              />
              <Field
                label="Height"
                name="height"
                value={form.height}
                onChange={handleChange}
              />
            </div>
            </div>
          )}

          {/* ------------------ Address ------------------ */}
          {activeTab === "Address" && (
            <div className="h-[335px]">
            <div className="grid  gap-4">
              <Field
                label="State"
                name="state"
                value={form.state}
                onChange={handleChange}
                icon={<MapPin className="w-4 h-4 text-gray-500" />}
              />
              <Field
                label="Home Address"
                name="homeAddress"
                value={form.homeAddress}
                onChange={handleChange}
              />
            </div>
            </div>
          )}

          {/* ------------------ Leave ------------------ */}
          {activeTab === "Leave" && (
            <div className="h-[335px]">
            <div className="grid grid-cols-2 gap-6">
              <Field
                label="EL Due"
                name="eldue"
                value={form.eldue}
                onChange={handleChange}
              />

              <Field
                label="CL Due"
                name="cldue"
                value={form.cldue}
                onChange={handleChange}
              />
              <Field
                label="EL Availed"
                name="elavailed"
                value={form.elavailed}
                onChange={handleChange}
              />
              <Field
                label="CL Availed"
                name="clavailed"
                value={form.clavailed}
                onChange={handleChange}
              />
            </div>
            </div>
          )}

          {/* ------------------ Service ------------------ */}
     {activeTab === "Service" && (
  <div className="h-[335px]"> {/* yaha height deni hai */}
    <div className="grid grid-cols-2 gap-6">
      <Field
        label="JD Pet 1st"
        name="jdpet1st"
        value={form.jdpet1st}
        onChange={handleChange}
        icon={<Briefcase className="w-4 h-4 text-gray-500" />}
      />
      <Field
        label="JD Pet 2st"
        name="jdpet2st"
        value={form.jdpet2st}
        onChange={handleChange}
      />
      <Field
        label="AME"
        name="ame"
        value={form.ame}
        onChange={handleChange}
      />
      <Field
        label="ARCF"
        name="arcf"
        value={form.arcf}
        onChange={handleChange}
      />
      <Field
        label="LTC"
        name="ltc"
        value={form.ltc}
        onChange={handleChange}
      />
    </div>
  </div>
)}


          {/* ------------------ Finance ------------------ */}
{activeTab === "Finance" && (
  <div className="h-[335px]">
    <div className="grid grid-cols-2 gap-6">
      <Field
        label="Bank A/C"
        name="bankac"
        value={form.bankac}
        onChange={handleChange}
      />
      <Field
        label="Branch Name"
        name="branchNo"
        value={form.branchNo}
        onChange={handleChange}
      />
      <Field
        label="IFSC Code"
        name="ifsc"
        value={form.ifsc}
        onChange={handleChange}
      />
      <Field
        label="MICR"
        name="micr"
        value={form.micr}
        onChange={handleChange}
      />
    </div>
  </div>
)}


          {/* ------------------ Other ------------------ */}
          {activeTab === "Other" && (
            <div className="h-[335px]">
            <div className="grid grid-cols-2 gap-6">
              <Field
                label="NOK"
                name="nok"
                value={form.nok}
                onChange={handleChange}
              />
              <Field
                label="Dependent"
                name="dependent"
                value={form.dependent}
                onChange={handleChange}
              />
              <Field
                label="I-Card NO"
                name="iCardNo"
                value={form.depiCardNoendent}
                onChange={handleChange}
              />
              <Field
                label="PPPS"
                name="ppps"
                value={form.ppps}
                onChange={handleChange}
              />
              <Field
                label="PLN"
                name="pln"
                value={form.pln}
                onChange={handleChange}
              />
              <Field
                label="SEC"
                name="sec"
                value={form.sec}
                onChange={handleChange}
              />
            </div></div>
          )}

          {/* ------------------ Readiness ------------------ */}
       {activeTab === "Readiness" && (

  <div className="p-4 h-[335px] space-y-4">
    <label className="flex items-center space-x-2">
      <input
        type="checkbox"
        name="specialDuty"
        checked={form.specialDuty || false}
        onChange={(e) =>
          setForm({ ...form, specialDuty: e.target.checked })
        }
        className="w-4 h-4 accent-blue-600"
      />
      <span className="text-gray-700">Special Duty</span>
    </label>
  </div>
)}

        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4  bg-gray-100 sticky bottom-0 z-10">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 font-medium transition"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              console.log("Save clicked:", form);
              onClose();
            }}
            className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-md transition"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

/* ------------------ Small Reusable Components ------------------ */
const Field = ({ label, name, value, onChange, required, icon }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
      {icon} {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      name={name}
      value={value || ""}
      onChange={onChange}
      placeholder={`Enter ${label}`}
      className="w-full border border-gray-300 rounded-lg px-3 py-2 
      focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
    />
  </div>
);

const DateField = ({ label, name, value, onChange, icon }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
      {icon} {label}
    </label>
    <input
      type="date"
      name={name}
      value={value || ""}
      onChange={onChange}
      className="w-full border border-gray-300 rounded-lg px-3 py-2 
      focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
    />
  </div>
);

const Select = ({ label, name, value, onChange, options, required }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <select
      name={name}
      value={value || ""}
      onChange={onChange}
      className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white 
      focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
    >
      <option value="">Select {label}</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </div>
);


// import { useEffect, useState } from "react";
// import {
//   User,
//   Calendar,
//   Award,
//   Phone,
//   MapPin,
//   HeartPulse,
//   Briefcase,
// } from "lucide-react";

// export default function ViewModel({ open, onClose, userId }) {
//   const [form, setForm] = useState({});
//   const [activeTab, setActiveTab] = useState("Identity");
//   const [loading, setLoading] = useState(false);

//   // Fetch user from backend
//   useEffect(() => {
//     if (!open || !userId) return;

//     const fetchUser = async () => {
//       setLoading(true);
//       try {
//         const res = await fetch(`/api/users/${userId}`);
//         const data = await res.json();
//         setForm(data);
//       } catch (err) {
//         console.error("Failed to fetch user:", err);
//         alert("Failed to load user data");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUser();
//   }, [open, userId]);

//   if (!open) return null;
//   if (loading) return <div className="p-6">Loading...</div>;

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   // const handleSave = async () => {
//   //   try {
//   //     const res = await fetch(`/api/users/${userId}`, {
//   //       method: "PUT",
//   //       headers: { "Content-Type": "application/json" },
//   //       body: JSON.stringify(form),
//   //     });
//   //     const data = await res.json();
//   //     console.log("User updated:", data);
//   //     alert("User updated successfully!");
//   //     onClose();
//   //   } catch (err) {
//   //     console.error("Error updating user:", err);
//   //     alert("Failed to save changes");
//   //   }
//   // };
// const handleSave = async () => {
//   if (!form._id) {
//     alert("User ID missing. Cannot save.");
//     return;
//   }

//   try {
//     const res = await fetch(`/users/${form._id}`, {
//       method: "PUT",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(form),
//     });

//     const data = await res.json();

//     if (!res.ok) throw new Error(data.message || "Unknown error");

//     console.log("User updated:", data);
//     alert("User updated successfully!");
//     onClose(); // close modal
//   } catch (err) {
//     console.error("Error updating user:", err);
//     alert("Failed to save changes: " + err.message);
//   }
// };


//   const tabs = [
//     "Identity",
//     "Contact",
//     "Background",
//     "Medical",
//     "Address",
//     "Leave",
//     "Service",
//     "Finance",
//     "Other",
//     "Readiness",
//   ];

//   return (
//     <div className="fixed inset-0 bg-transparent/50 backdrop-blur-sm flex items-center justify-center z-50">
//       <div className="bg-white w-[950px] max-h-[90vh] rounded-lg shadow-2xl overflow-hidden flex flex-col border border-gray-200">
//         {/* Header */}
//         <div className="flex justify-between items-center px-6 py-2 bg-gray-100 sticky top-0 z-10">
//           <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
//             <User className="w-5 h-5 text-blue-600" />
//             View / Edit Personnel
//           </h2>
//           <button
//             onClick={onClose}
//             className="text-gray-500 hover:text-red-600 text-2xl font-bold transition"
//           >
//             ✕
//           </button>
//         </div>

//         {/* Tabs */}
//         <div className="flex gap-1 px-1 text-sm font-medium mt-2 overflow-x-auto sticky top-[61px] z-10">
//           {tabs.map((tab) => (
//             <button
//               key={tab}
//               onClick={() => setActiveTab(tab)}
//               className={`px-4 py-1 border border-gray-300 cursor-pointer last:border-none transition whitespace-nowrap 
//               rounded-2xl  ${
//                 activeTab === tab
//                   ? "bg-white text-blue-600 font-semibold "
//                   : "text-gray-600 hover:bg-gray-200 bg-gray-100 "
//               }`}
//             >
//               {tab}
//             </button>
//           ))}
//         </div>

//         {/* Content Area */}
//         <div className="flex-1 overflow-y-auto p-6 bg-gray-50/30">
//           {/* ------------------ Identity ------------------ */}
//           {activeTab === "Identity" && (
//             <div className="grid grid-cols-2 gap-6">
//               <Field label="Force No" name="forceNo" required value={form.forceNo} onChange={handleChange} />
//               <Select
//                 label="Rank"
//                 name="rank"
//                 required
//                 value={form.rank}
//                 onChange={handleChange}
//                 options={["Constable", "Head Constable", "Sub-Inspector"]}
//               />
//               <Field label="Name" name="name" required value={form.name} onChange={handleChange} />
//               <DateField label="Date of Birth" name="dob" value={form.dob} onChange={handleChange} icon={<Calendar className="w-4 h-4 text-gray-500" />} />
//               <DateField label="DOE (Date of Enlistment)" name="doe" value={form.doe} onChange={handleChange} />
//               <DateField label="DOA Coy" name="doaCoy" value={form.doaCoy} onChange={handleChange} />
//               <DateField label="DOA Unit" name="doaUnit" value={form.doaUnit} onChange={handleChange} />
//               <DateField label="DOP (Date of Promotion)" name="dop" value={form.dop} onChange={handleChange} icon={<Award className="w-4 h-4 text-gray-500" />} />
//             </div>
//           )}

//           {/* ------------------ Contact ------------------ */}
//           {activeTab === "Contact" && (
//             <div className="h-[335px] overflow-y-auto p-4 bg-gray-50 rounded">
//               <Field label="Mobile Number" name="mobile" value={form.mobile} onChange={handleChange} icon={<Phone className="w-4 h-4 text-gray-500" />} />
//             </div>
//           )}

//           {/* ------------------ Background ------------------ */}
//           {activeTab === "Background" && (
//             <div className="h-[335px]">
//               <div className="grid grid-cols-2 gap-6">
//                 <Field label="Religion" name="religion" value={form.religion} onChange={handleChange} />
//                 <Field label="Education" name="education" value={form.education} onChange={handleChange} />
//                 <Field label="Caste" name="caste" value={form.caste} onChange={handleChange} />
//                 <Field label="Course" name="course" value={form.course} onChange={handleChange} />
//               </div>
//             </div>
//           )}

//           {/* ------------------ Medical ------------------ */}
//           {activeTab === "Medical" && (
//             <div className="h-[335px]">
//               <div className="grid grid-cols-2 gap-6">
//                 <Field label="Blood Group" name="bloodGroup" value={form.bloodGroup} onChange={handleChange} icon={<HeartPulse className="w-4 h-4 text-red-500" />} />
//                 <Field label="Height" name="height" value={form.height} onChange={handleChange} />
//               </div>
//             </div>
//           )}

//           {/* ------------------ Address ------------------ */}
//           {activeTab === "Address" && (
//             <div className="h-[335px]">
//               <div className="grid gap-4">
//                 <Field label="State" name="state" value={form.state} onChange={handleChange} icon={<MapPin className="w-4 h-4 text-gray-500" />} />
//                 <Field label="Home Address" name="homeAddress" value={form.homeAddress} onChange={handleChange} />
//               </div>
//             </div>
//           )}

//           {/* ------------------ Leave ------------------ */}
//           {activeTab === "Leave" && (
//             <div className="h-[335px]">
//               <div className="grid grid-cols-2 gap-6">
//                 <Field label="EL Due" name="eldue" value={form.eldue} onChange={handleChange} />
//                 <Field label="CL Due" name="cldue" value={form.cldue} onChange={handleChange} />
//                 <Field label="EL Availed" name="elavailed" value={form.elavailed} onChange={handleChange} />
//                 <Field label="CL Availed" name="clavailed" value={form.clavailed} onChange={handleChange} />
//               </div>
//             </div>
//           )}

//           {/* ------------------ Service ------------------ */}
//           {activeTab === "Service" && (
//             <div className="h-[335px]">
//               <div className="grid grid-cols-2 gap-6">
//                 <Field label="JD Pet 1st" name="jdpet1st" value={form.jdpet1st} onChange={handleChange} icon={<Briefcase className="w-4 h-4 text-gray-500" />} />
//                 <Field label="JD Pet 2st" name="jdpet2st" value={form.jdpet2st} onChange={handleChange} />
//                 <Field label="AME" name="ame" value={form.ame} onChange={handleChange} />
//                 <Field label="ARCF" name="arcf" value={form.arcf} onChange={handleChange} />
//                 <Field label="LTC" name="ltc" value={form.ltc} onChange={handleChange} />
//               </div>
//             </div>
//           )}

//           {/* ------------------ Finance ------------------ */}
//           {activeTab === "Finance" && (
//             <div className="h-[335px]">
//               <div className="grid grid-cols-2 gap-6">
//                 <Field label="Bank A/C" name="bankac" value={form.bankac} onChange={handleChange} />
//                 <Field label="Branch Name" name="branchNo" value={form.branchNo} onChange={handleChange} />
//                 <Field label="IFSC Code" name="ifsc" value={form.ifsc} onChange={handleChange} />
//                 <Field label="MICR" name="micr" value={form.micr} onChange={handleChange} />
//               </div>
//             </div>
//           )}

//           {/* ------------------ Other ------------------ */}
//           {activeTab === "Other" && (
//             <div className="h-[335px]">
//               <div className="grid grid-cols-2 gap-6">
//                 <Field label="NOK" name="nok" value={form.nok} onChange={handleChange} />
//                 <Field label="Dependent" name="dependent" value={form.dependent} onChange={handleChange} />
//                 <Field label="I-Card NO" name="iCardNo" value={form.iCardNo} onChange={handleChange} />
//                 <Field label="PPPS" name="ppps" value={form.ppps} onChange={handleChange} />
//                 <Field label="PLN" name="pln" value={form.pln} onChange={handleChange} />
//                 <Field label="SEC" name="sec" value={form.sec} onChange={handleChange} />
//               </div>
//             </div>
//           )}

//           {/* ------------------ Readiness ------------------ */}
//           {activeTab === "Readiness" && (
//             <div className="p-4 h-[335px] space-y-4">
//               <label className="flex items-center space-x-2">
//                 <input
//                   type="checkbox"
//                   name="specialDuty"
//                   checked={form.specialDuty || false}
//                   onChange={(e) => setForm({ ...form, specialDuty: e.target.checked })}
//                   className="w-4 h-4 accent-blue-600"
//                 />
//                 <span className="text-gray-700">Special Duty</span>
//               </label>
//             </div>
//           )}
//         </div>

//         {/* Footer */}
//         <div className="flex justify-end gap-3 px-6 py-4 bg-gray-100 sticky bottom-0 z-10">
//           <button onClick={onClose} className="px-5 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 font-medium transition">
//             Cancel
//           </button>
//           <button onClick={handleSave} className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-md transition">
//             Save
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// /* ------------------ Small Reusable Components ------------------ */
// const Field = ({ label, name, value, onChange, required, icon }) => (
//   <div>
//     <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
//       {icon} {label} {required && <span className="text-red-500">*</span>}
//     </label>
//     <input
//       name={name}
//       value={value || ""}
//       onChange={onChange}
//       placeholder={`Enter ${label}`}
//       className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
//     />
//   </div>
// );

// const DateField = ({ label, name, value, onChange, icon }) => (
//   <div>
//     <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
//       {icon} {label}
//     </label>
//     <input
//       type="date"
//       name={name}
//       value={value || ""}
//       onChange={onChange}
//       className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
//     />
//   </div>
// );

// const Select = ({ label, name, value, onChange, options, required }) => (
//   <div>
//     <label className="block text-sm font-medium text-gray-700 mb-1">
//       {label} {required && <span className="text-red-500">*</span>}
//     </label>
//     <select
//       name={name}
//       value={value || ""}
//       onChange={onChange}
//       className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
//     >
//       <option value="">Select {label}</option>
//       {options.map((opt) => (
//         <option key={opt} value={opt}>{opt}</option>
//       ))}
//     </select>
//   </div>
// );
