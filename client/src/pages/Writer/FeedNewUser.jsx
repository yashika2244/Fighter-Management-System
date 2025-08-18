import { useState } from "react";
import { api } from "../../lib/axios";
import { useNavigate } from "react-router-dom";
import Topbar from "../../components/Topbar.jsx";

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

  // ----------------- Updates -------------------
  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const updateDates = (e) =>
    setDatesForm({ ...datesForm, [e.target.name]: e.target.value });
  const updateLeave = (e) =>
    setLeaveForm({ ...leaveForm, [e.target.name]: e.target.value });
  const updateBank = (e) =>
    setBankForm({ ...bankForm, [e.target.name]: e.target.value });

  // ----------------- Submits -------------------
  const submit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/users", form);
        setUserId(data._id);
      setMsg(`✅ Saved: ${data.name} (${data.forceNo})`);
      setForm(initialForm);
    } catch (err) {
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

  // ----------------- Clear / Back -------------------
  const clear = () => {
    if (activeTab === "basic") setForm(initialForm);
    if (activeTab === "dates") setDatesForm({});
    if (activeTab === "leave") setLeaveForm({});
    if (activeTab === "bank") setBankForm({});
  };
  const back = () => navigate(-1);

  // ----------------- UI -------------------
  return (
    <div className="p-4 flex-1">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold uppercase">Feed New User</h2>
        <Topbar />
      </div>

      {/* Tabs */}
      <div className="flex mt-6 border-b border-gray-400">
        {["basic", "dates", "leave", "bank"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm rounded-t-md transition-all
              ${
                activeTab === tab
                  ? "bg-white font-medium border-x border-t border-gray-400 -mb-[1px]"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200 border-b border-gray-400"
              }`}
          >
            {tab === "basic"
              ? "Basic"
              : tab === "dates"
              ? "Dates"
              : tab === "leave"
              ? "Leave/Records"
              : "Bank"}
          </button>
        ))}
      </div>

      {/* Basic Tab */}
      {activeTab === "basic" && (
        <form
          onSubmit={submit}
          className="border border-gray-400 bg-white p-0 max-w-5xl"
        >
          <table className="w-full border-collapse text-sm">
            <tbody>
              {[
                ["SL NO", "slNo", "FORCE NO", "forceNo"],
                ["RANK", "rank", "NAME", "name"],
                ["MOBILE NO", "mobileNo", "STATE", "state"],
                ["RELIGION", "religion", "CASTE", "caste"],
                ["BG", "bg", "HOME ADDRESS", "homeAddress"],
                ["HEIGHT", "height", "DEPENDENT", "dependent"],
                ["NOK", "nok", "ICARD NO", "icardNo"],
              ].map(([label1, name1, label2, name2]) => (
                <tr key={name1 + name2}>
                  <td className="px-3 py-2 w-40 bg-gray-100 border-r border-gray-300">
                    {label1}
                  </td>
                  <td className="px-2 py-2 border-r border-gray-300">
                    <input
                      name={name1}
                      value={form[name1]}
                      onChange={update}
                      className="w-full border border-gray-400 px-2 py-1 text-sm"
                    />
                  </td>
                  <td className="px-3 py-2 w-40 bg-gray-100 border-r border-gray-300">
                    {label2}
                  </td>
                  <td className="px-2 py-2">
                    <input
                      name={name2}
                      value={form[name2]}
                      onChange={update}
                      className="w-full border border-gray-400 px-2 py-1 text-sm"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Buttons */}
          <div className="flex gap-4 p-4 border-t border-gray-300 bg-gray-50">
            <button type="submit" className="px-6 py-2 border bg-gray-200">
              Save
            </button>
            <button type="button" onClick={clear} className="px-6 py-2 border bg-gray-200">
              Clear
            </button>
            <button type="button" onClick={back} className="px-6 py-2 border bg-gray-200">
              Back
            </button>
          </div>
        </form>
      )}

      {/* Dates Tab */}
      {activeTab === "dates" && (
        <form
          onSubmit={submitDates}
          className="border border-gray-400 bg-white p-0 max-w-5xl"
        >
          <table className="w-full border-collapse text-sm">
            <tbody>
              {[
                ["DOA COY", "doaCoy", "DOA UNIT", "doaUnit"],
                ["DOB", "dob", "DOE", "doe"],
                ["DOP", "dop", "JD PET 1ST", "jdPet1st"],
                ["JD PET 2ND", "jdPet2nd", "", ""],
              ].map(([label1, name1, label2, name2]) => (
                <tr key={name1 + name2}>
                  <td className="px-3 py-2 w-40 bg-gray-100 border-r border-gray-300">
                    {label1}
                  </td>
                  <td className="px-2 py-2 border-r border-gray-300">
                    <input
                      name={name1}
                      value={datesForm[name1] || ""}
                      onChange={updateDates}
                      className="w-full border border-gray-400 px-2 py-1 text-sm"
                    />
                  </td>
                  {label2 && (
                    <>
                      <td className="px-3 py-2 w-40 bg-gray-100 border-r border-gray-300">
                        {label2}
                      </td>
                      <td className="px-2 py-2">
                        <input
                          name={name2}
                          value={datesForm[name2] || ""}
                          onChange={updateDates}
                          className="w-full border border-gray-400 px-2 py-1 text-sm"
                        />
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          {/* Buttons */}
          <div className="flex gap-4 p-4 border-t border-gray-300 bg-gray-50">
            <button type="submit" className="px-6 py-2 border bg-gray-200">
              Save
            </button>
            <button type="button" onClick={clear} className="px-6 py-2 border bg-gray-200">
              Clear
            </button>
            <button type="button" onClick={back} className="px-6 py-2 border bg-gray-200">
              Back
            </button>
          </div>
        </form>
      )}

      {/* Leave Tab */}
      {activeTab === "leave" && (
        <form
          onSubmit={submitLeave}
          className="border border-gray-400 bg-white p-0 max-w-5xl"
        >
          <table className="w-full border-collapse text-sm">
            <tbody>
              {[
                ["EL DUE", "elDue", "EL AVAILED", "elAvailed"],
                ["CL DUE", "clDue", "CL AVAILED", "clAvailed"],
                ["COURSE", "course", "EDN", "edn"],
                ["AME", "ame", "ARCF", "arcf"],
                ["LTC", "ltc", "PPPS", "ppps"],
                ["PLN", "pln", "SEC", "sec"],
                ["SPL DUTY", "splDuty", "", ""],
              ].map(([label1, name1, label2, name2]) => (
                <tr key={name1 + name2}>
                  <td className="px-3 py-2 w-40 bg-gray-100 border-r border-gray-300">
                    {label1}
                  </td>
                  <td className="px-2 py-2 border-r border-gray-300">
                    <input
                      name={name1}
                      value={leaveForm[name1] || ""}
                      onChange={updateLeave}
                      className="w-full border border-gray-400 px-2 py-1 text-sm"
                    />
                  </td>
                  {label2 && (
                    <>
                      <td className="px-3 py-2 w-40 bg-gray-100 border-r border-gray-300">
                        {label2}
                      </td>
                      <td className="px-2 py-2">
                        <input
                          name={name2}
                          value={leaveForm[name2] || ""}
                          onChange={updateLeave}
                          className="w-full border border-gray-400 px-2 py-1 text-sm"
                        />
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          {/* Buttons */}
          <div className="flex gap-4 p-4 border-t border-gray-300 bg-gray-50">
            <button type="submit" className="px-6 py-2 border bg-gray-200">
              Save
            </button>
            <button type="button" onClick={clear} className="px-6 py-2 border bg-gray-200">
              Clear
            </button>
            <button type="button" onClick={back} className="px-6 py-2 border bg-gray-200">
              Back
            </button>
          </div>
        </form>
      )}

      {/* Bank Tab */}
      {activeTab === "bank" && (
        <form
          onSubmit={submitBank}
          className="border border-gray-400 bg-white p-0 max-w-5xl"
        >
          <table className="w-full border-collapse text-sm">
            <tbody>
              {[
                ["BANK ACCT", "bankAcct", "BR NAME", "brName"],
                ["IFSC CODE", "ifscCode", "MICR", "micr"],
              ].map(([label1, name1, label2, name2]) => (
                <tr key={name1 + name2}>
                  <td className="px-3 py-2 w-40 bg-gray-100 border-r border-gray-300">
                    {label1}
                  </td>
                  <td className="px-2 py-2 border-r border-gray-300">
                    <input
                      name={name1}
                      value={bankForm[name1] || ""}
                      onChange={updateBank}
                      className="w-full border border-gray-400 px-2 py-1 text-sm"
                    />
                  </td>
                  {label2 && (
                    <>
                      <td className="px-3 py-2 w-40 bg-gray-100 border-r border-gray-300">
                        {label2}
                      </td>
                      <td className="px-2 py-2">
                        <input
                          name={name2}
                          value={bankForm[name2] || ""}
                          onChange={updateBank}
                          className="w-full border border-gray-400 px-2 py-1 text-sm"
                        />
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          {/* Buttons */}
          <div className="flex gap-4 p-4 border-t border-gray-300 bg-gray-50">
            <button type="submit" className="px-6 py-2 border bg-gray-200">
              Save
            </button>
            <button type="button" onClick={clear} className="px-6 py-2 border bg-gray-200">
              Clear
            </button>
            <button type="button" onClick={back} className="px-6 py-2 border bg-gray-200">
              Back
            </button>
          </div>
        </form>
      )}

      {msg && <p className="mt-3 text-green-600">{msg}</p>}
    </div>
  );
}
