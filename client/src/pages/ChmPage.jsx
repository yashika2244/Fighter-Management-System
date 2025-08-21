import { useEffect, useState } from "react";
import DutyAssign from "../components/DutyAssign";
import { api } from "../lib/axios";

const ChmPage = () => {
  const [activeTab, setActiveTab] = useState("assign");
  const [dutyTypes, setDutyTypes] = useState([]);
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [editingType, setEditingType] = useState(null);
  const [typeForm, setTypeForm] = useState({
    name: "",
    requiresSubCategory: false,
    subCategories: "",
    active: true,
  });

  useEffect(() => {
    if (activeTab === "types") loadTypes();
  }, [activeTab]);

  const loadTypes = async () => {
    const { data } = await api.get("/duties/types");
    setDutyTypes(data);
  };

  const openCreate = () => {
    setEditingType(null);
    setTypeForm({ name: "", requiresSubCategory: false, subCategories: "", active: true });
    setShowTypeModal(true);
  };

  const openEdit = (t) => {
    setEditingType(t);
    setTypeForm({
      name: t.name,
      requiresSubCategory: !!t.requiresSubCategory,
      subCategories: (t.subCategories || []).join(", "),
      active: t.active,
    });
    setShowTypeModal(true);
  };

  const saveType = async (e) => {
    e.preventDefault();
    const payload = {
      name: typeForm.name.trim(),
      requiresSubCategory: !!typeForm.requiresSubCategory,
      subCategories: typeForm.subCategories
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      active: !!typeForm.active,
    };
    if (editingType) {
      await api.put(`/duties/types/${editingType._id}`, payload);
    } else {
      await api.post("/duties/types", payload);
    }
    setShowTypeModal(false);
    setEditingType(null);
    loadTypes();
  };

  const removeType = async (id) => {
    if (!confirm("Delete this duty type?")) return;
    await api.delete(`/duties/types/${id}`);
    loadTypes();
  };

  return (
    <div className="px-4 py-6">
      {/* Tabs */}
      <div className="bg-white rounded-lg border border-gray-200 p-2 mb-6">
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab("assign")}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              activeTab === "assign" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-700"
            }`}
          >
            Assign Duty
          </button>
          <button
            onClick={() => setActiveTab("types")}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              activeTab === "types" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-700"
            }`}
          >
            Manage Duty Types
          </button>
        </div>
      </div>

      {activeTab === "assign" && (
        <div className="">
          <DutyAssign />
        </div>
      )}

      {activeTab === "types" && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Duty Types</h2>
        <button
              onClick={openCreate}
              className="px-3 py-2 bg-gray-900 text-white rounded-md text-sm"
            >
              Add Duty Type
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Requires Sub-Category</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Sub-Categories</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-2"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {dutyTypes.map((t) => (
                  <tr key={t._id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 text-sm text-gray-900">{t.name}</td>
                    <td className="px-4 py-2 text-sm">{t.requiresSubCategory ? "Yes" : "No"}</td>
                    <td className="px-4 py-2 text-sm text-gray-600">
                      {(t.subCategories || []).join(", ") || "—"}
                    </td>
                    <td className="px-4 py-2 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs ${t.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                        {t.active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-sm text-right space-x-2">
                      <button onClick={() => openEdit(t)} className="px-3 py-1 border border-gray-300 rounded-md">
                        Edit
                      </button>
                      <button onClick={() => removeType(t._id)} className="px-3 py-1 border border-gray-300 rounded-md">
                        Delete
        </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showTypeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg border border-gray-200 p-6 w-full max-w-lg">
            <h3 className="text-lg font-semibold mb-4">{editingType ? "Edit Duty Type" : "Add Duty Type"}</h3>
            <form onSubmit={saveType} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name *</label>
                <input
                  value={typeForm.name}
                  onChange={(e) => setTypeForm({ ...typeForm, name: e.target.value })}
                  className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2"
                  required
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  id="reqSub"
                  type="checkbox"
                  checked={typeForm.requiresSubCategory}
                  onChange={(e) => setTypeForm({ ...typeForm, requiresSubCategory: e.target.checked })}
                  className="h-4 w-4"
                />
                <label htmlFor="reqSub" className="text-sm text-gray-700">Requires sub-category</label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Sub-categories (comma separated)</label>
                <input
                  value={typeForm.subCategories}
                  onChange={(e) => setTypeForm({ ...typeForm, subCategories: e.target.value })}
                  className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="e.g., Mess Duty, Kote Commander Duty"
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  id="active"
                  type="checkbox"
                  checked={typeForm.active}
                  onChange={(e) => setTypeForm({ ...typeForm, active: e.target.checked })}
                  className="h-4 w-4"
                />
                <label htmlFor="active" className="text-sm text-gray-700">Active</label>
              </div>
              <div className="flex space-x-3 pt-2">
                <button type="submit" className="px-4 py-2 bg-gray-900 text-white rounded-md">Save</button>
                <button type="button" onClick={() => setShowTypeModal(false)} className="px-4 py-2 border border-gray-300 rounded-md">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChmPage;
