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
      await api.post("/user-dates", { ...datesForm, userId });
      setMsg("✅ Dates Saved!");
      setDatesForm({});
    } catch {
      setMsg("❌ Error saving dates!");
    }
  };

  const submitLeave = async (e) => {
    e.preventDefault();
    try {
      await api.post("/user-leaves", { ...leaveForm, userId });
      setMsg("✅ Leave Saved!");
      setLeaveForm({});
    } catch {
      setMsg("❌ Error saving leave!");
    }
  };

  const submitBank = async (e) => {
    e.preventDefault();
    try {
      await api.post("/user-bank", { ...bankForm, userId });
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
    <div className="p-6 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-700 flex items-center gap-2">
          <UserPlus className="text-blue-500" /> Feed New User
        </h2>
        <Topbar />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-300 mb-3">
        {[
          { id: "basic", label: "Basic", icon: UserPlus },
          { id: "dates", label: "Dates", icon: Calendar },
          { id: "leave", label: "Leave/Records", icon: ClipboardList },
          { id: "bank", label: "Bank", icon: Banknote },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`relative cursor-pointer flex items-center gap-2 px-6 py-2.5 text-sm font-semibold transition-all duration-300
    ${
      activeTab === id ? "text-blue-600" : "text-gray-500 hover:text-gray-700"
    }`}
          >
            <Icon size={18} />
            {label}

            {/* Active underline effect */}
            {activeTab === id && (
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-blue-600 rounded-t-md"></span>
            )}
          </button>
        ))}
      </div>

      {/* Form Wrapper */}
      <div className="bg-white border border-gray-200 shadow rounded-lg p-2 px-4 max-w-5xl">
        {/* Basic Tab */}
        {activeTab === "basic" && (
          <form onSubmit={submit} className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
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
            <div className="flex gap-3  ">
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
          <form onSubmit={submitDates} className="grid grid-cols-2 gap-4">
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

            <div className="col-span-2 flex gap-3 pt-4 ">
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
          <form onSubmit={submitLeave} className="grid grid-cols-2 gap-4">
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

            <div className="col-span-2 flex gap-3 pt-4 ">
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
          <form onSubmit={submitBank} className="grid grid-cols-2 gap-4">
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

            <div className="col-span-2 flex gap-3 pt-4">
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
