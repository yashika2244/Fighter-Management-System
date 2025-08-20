
import { useState, useEffect } from "react";
import { api } from "../lib/axios";
import Topbar from "./Topbar";

export default function InventoryPage() {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState("30");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🔹 Modal states
  const [showWarning, setShowWarning] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showStockInForm, setShowStockInForm] = useState(false);
  const [showStockOutForm, setShowStockOutForm] = useState(false);

  // 🔹 Selected row
  const [selectedItem, setSelectedItem] = useState(null);

  // 🔹 Form states
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    unit: "",
    qty: "",
    minQty: "",
    location: "",
    notes: "",
  });

  const [transaction, setTransaction] = useState({ qty: "", note: "" });

  useEffect(() => {
    fetchItems();
  }, [filter]);

  const fetchItems = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get(`/inventory?days=${filter}`);
      setItems(res.data);
    } catch (err) {
      setError("⚠ Failed to fetch inventory data.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Add new item
  const handleAddItem = async (e) => {
    e.preventDefault();
    try {
      await api.post("/inventory", formData);
      setShowForm(false);
      setFormData({
        name: "",
        sku: "",
        unit: "",
        qty: "",
        minQty: "",
        location: "",
        notes: "",
      });
      fetchItems();
    } catch (err) {
      alert("❌ Failed to add item");
      console.error(err);
    }
  };

  // ✅ Stock IN submit
  const handleStockInSubmit = async (e) => {
    if (!selectedItem) {
      setShowWarning(true);
      return;
    }
    e.preventDefault();
    try {
      await api.put(`/inventory/stock-in/${selectedItem._id}`, {
        qty: transaction.qty,
        note: transaction.note,
      });
      setShowStockInForm(false);
      setTransaction({ qty: "", note: "" });
      fetchItems();
    } catch (err) {
      alert("❌ Failed to stock in");
      console.error(err);
    }
  };

  // ✅ Stock OUT submit
  const handleStockOutSubmit = async (e) => {
    e.preventDefault();
    if (!selectedItem) {
      setShowWarning(true);
      return;
    }
    try {
      await api.put(`/inventory/stock-out/${selectedItem._id}`, {
        qty: transaction.qty,
        note: transaction.note,
      });
      setShowStockOutForm(false);
      setTransaction({ qty: "", note: "" });
      fetchItems();
    } catch (err) {
      alert("❌ Failed to stock out");
      console.error(err);
    }
  };

  // ✅ Search filter
  const filteredItems = items.filter(
    (item) =>
      item.name?.toLowerCase().includes(search.toLowerCase()) ||
      item.sku?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-3">
        <h1 className="font-bold text-2xl text-gray-800">
          📦 CQMH — Inventory
        </h1>
        <Topbar />
      </div>

      {showWarning && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/10">
          <div className="bg-white p-6 rounded-md shadow-xl w-80 text-center ">
            <p className="text-lg font-semibold text-red-600">
              ⚠️ Select an item first
            </p>
            <button
              onClick={() => setShowWarning(false)}
              className="mt-4 px-4 py-1 bg-blue-600 cursor-pointer text-white rounded-lg hover:bg-blue-700 transition"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 shadow-sm cursor-pointer"
        >
          ➕ Add Item
        </button>
        <button
          onClick={() => {
            if (!selectedItem) {
              setShowWarning(true); // 👈 show modal
            } else {
              setShowStockInForm(true);
            }
          }}
          className="px-4 py-2 rounded-lg shadow-sm bg-cyan-500 text-white hover:bg-cyan-600 cursor-pointer"
        >
          Stock IN
        </button>

        <button
          onClick={() => {
            if (!selectedItem) {
              setShowWarning(true); // 👈 show modal
            } else {
              setShowStockOutForm(true);
            }
          }}
          className="px-4 py-2 rounded-lg shadow-sm bg-gray-500 text-white hover:bg-gray-600 cursor-pointer"
        >
          Stock OUT
        </button>
      </div>

      {/* ✅ Add Item Modal */}
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/10 bg-opacity-50">
          <form
            onSubmit={handleAddItem}
            className="bg-white p-6 rounded-md shadow-lg w-full max-w-xl"
          >
            <h2 className="text-xl font-bold mb-4">➕ Add New Item</h2>

            {[
              { key: "name", label: "Item Name" },
              { key: "sku", label: "SKU" },
              { key: "unit", label: "Unit" },
              { key: "qty", label: "Qty (Start)" },
              { key: "minQty", label: "Min Qty" },
              { key: "location", label: "Location" },
              { key: "notes", label: "Notes" },
            ].map(({ key, label }) => (
              <div key={key} className="mb-3 flex items-center gap-5">
                <label className="block text-gray-700 capitalize w-32">
                  {label}
                </label>
                <input
                  type={key.toLowerCase().includes("qty") ? "number" : "text"}
                  value={formData[key] || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, [key]: e.target.value })
                  }
                  className="flex-1 p-2 border border-gray-300 outline-none rounded-md"
                  required={key === "name" || key === "sku"}
                />
              </div>
            ))}

            <div className="flex justify-end gap-3 mt-4">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ✅ Stock IN Modal */}
      {showStockInForm && selectedItem && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/20">
          <form
            onSubmit={handleStockInSubmit}
            className="bg-white p-6 rounded-md shadow-lg w-full max-w-sm"
          >
            <h2 className="text-lg font-bold mb-4">
              IN Transaction — {selectedItem.name}
            </h2>
            <div className="mb-3">
              <label className="block mb-1 text-gray-700 font-medium">
                Qty
              </label>
              <input
                type="number"
                value={transaction.qty}
                onChange={(e) =>
                  setTransaction({ ...transaction, qty: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>

            <div className="mb-3">
              <label className="block mb-1 text-gray-700 font-medium">
                Ref/Note
              </label>
              <input
                type="text"
                value={transaction.note}
                onChange={(e) =>
                  setTransaction({ ...transaction, note: e.target.value })
                }
                className="w-full p-2 border  border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowStockInForm(false)}
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-green-600"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ✅ Stock OUT Modal */}
      {showStockOutForm && selectedItem && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30">
          <form
            onSubmit={handleStockOutSubmit}
            className="bg-white p-6 rounded-md shadow-lg w-full max-w-sm"
          >
            <h2 className="text-lg font-bold mb-4">
              OUT Transaction — {selectedItem.name}
            </h2>
            <div className="mb-3">
              <label className="block text-gray-700">Qty</label>
              <input
                type="number"
                value={transaction.qty}
                onChange={(e) =>
                  setTransaction({ ...transaction, qty: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div className="mb-3">
              <label className="block text-gray-700">Ref/Note</label>
              <input
                type="text"
                value={transaction.note}
                onChange={(e) =>
                  setTransaction({ ...transaction, note: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowStockOutForm(false)}
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-md">
        {loading ? (
          <p className="p-6 text-center text-gray-600 animate-pulse">
            ⏳ Loading inventory...
          </p>
        ) : (
          <table className="min-w-full border rounded-lg overflow-hidden">
            <thead className="bg-gray-200">
              <tr>
                {[
                  "ID",
                  "ITEM NAME",
                  "SKU",
                  "UNIT",
                  "QTY",
                  "MIN QTY",
                  "LOCATION",
                ].map((col) => (
                  <th
                    key={col}
                    className="px-4 py-3  text-sm font-bold text-gray-700 uppercase text-center "
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {error ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-4 py-6 text-center text-red-500 font-semibold"
                  >
                    {error}
                  </td>
                </tr>
              ) : filteredItems.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-4 py-6 text-center text-gray-500"
                  >
                    No items found.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item, index) => (
                  <tr
                    key={item._id}
                    className={`border-b border-gray-200 cursor-pointer ${
                      selectedItem?._id === item._id
                        ? "bg-blue-100"
                        : "hover:bg-gray-50"
                    }`}
                    onClick={() => setSelectedItem(item)}
                  >
                    <td className="px-4 py-2 text-center text-xs text-gray-600">
                      {index + 1}
                    </td>
                    <td className="px-4 py-2 text-center font-medium text-gray-800">
                      {item.name}
                    </td>
                    <td className="px-4 py-2 text-center  text-gray-600">{item.sku}</td>
                    <td className="px-4 py-2 text-center  text-gray-600">{item.unit}</td>
                    <td
                      className={`px-4 py-2 text-center font-semibold ${
                        item.qty <= item.minQty
                          ? "text-red-600"
                          : "text-green-600"
                      }`}
                    >
                      {item.qty}
                    </td>
                    <td className="px-4 py-2 text-center  text-gray-600">{item.minQty}</td>
                    <td className="px-4 py-2 text-center  text-gray-600">{item.location}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
