import { useState, useEffect } from "react";
import { api } from "../lib/axios";
import Topbar from "./Topbar";

export default function InventoryPage() {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState("30");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

  // ✅ Search filter frontend side
  const filteredItems = items.filter((item) =>
    item.name?.toLowerCase().includes(search.toLowerCase()) ||
    item.sku?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-3">
        <h1 className="font-bold text-2xl text-gray-800">📦 CQMH — Inventory</h1>
        {/* <div className="flex gap-3">
          <input
            type="text"
            placeholder="🔍 Search by Name or SKU"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded-lg px-3 py-2 w-60 shadow-sm focus:ring-2 focus:ring-blue-400 outline-none"
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border rounded-lg px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-400 outline-none"
          >
            <option value="30">Last 30 days</option>
            <option value="60">Last 60 days</option>
          </select>
        </div> */}
        <Topbar/>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mb-6">
        <button className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 shadow-sm">
          ➕ Add Item
        </button>
        <button className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-green-600 shadow-sm">
           Stock IN
        </button>
        <button className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-red-600 shadow-sm">
           Stock OUT
        </button>
      </div>

      {/* Table / Loading / Error */}
      <div className="overflow-x-auto bg-white shadow-lg rounded-xl">
        {loading ? (
          <p className="p-6 text-center text-gray-600 animate-pulse">
            ⏳ Loading inventory...
          </p>
        ) : error ? (
          <p className="p-6 text-center text-red-500 font-semibold">{error}</p>
        ) : filteredItems.length === 0 ? (
          <p className="p-6 text-center text-gray-500">No items found.</p>
        ) : (
          <table className="min-w-full border rounded-lg overflow-hidden">
            <thead className="bg-gray-200">
              <tr>
                {["ID", "ITEM NAME", "SKU", "UNIT", "QTY", "MIN QTY", "LOCATION"].map(
                  (col) => (
                    <th
                      key={col}
                      className="px-4 py-3 text-left text-sm font-bold text-gray-700 uppercase"
                    >
                      {col}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => (
                <tr
                  key={item._id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-3 text-xs text-gray-400">{item._id}</td>
                  <td className="px-4 py-3 font-medium text-gray-800">{item.name}</td>
                  <td className="px-4 py-3 text-gray-600">{item.sku}</td>
                  <td className="px-4 py-3 text-gray-600">{item.unit}</td>
                  <td
                    className={`px-4 py-3 font-semibold ${
                      item.qty <= item.minQty
                        ? "text-red-600"
                        : "text-green-600"
                    }`}
                  >
                    {item.qty}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{item.minQty}</td>
                  <td className="px-4 py-3 text-gray-600">{item.location}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
