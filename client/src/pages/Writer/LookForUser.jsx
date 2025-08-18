import { useEffect, useState } from "react";
import { api } from "../../lib/axios";

export default function LookForUser() {
  const [q, setQ] = useState("");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const load = async (query = "") => {
    try {
      setLoading(true);
      setError("");
      const { data } = await api.get("/users", { params: { q: query } });
      setRows(data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="p-8">
      <h2 className="text-lg font-semibold mb-4">Look for any user</h2>

      {/* Search bar */}
      <div className="flex gap-2 mb-4">
        <input
          className="border rounded px-3 py-2 flex-1 focus:ring-2 focus:ring-gray-500"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search name / service no / rank ..."
        />
        <button
          onClick={() => load(q)}
          className="bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-700"
        >
          Search
        </button>
      </div>

      {/* Error message */}
      {error && <p className="text-red-500 mb-3">{error}</p>}

      {/* Loader */}
      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        <table className="w-full text-sm border border-gray-200 rounded">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Service No</th>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Rank</th>
              <th className="p-2 border">Trade</th>
              <th className="p-2 border">Unit</th>
              <th className="p-2 border">Phone</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center text-gray-500 p-4">
                  No users found
                </td>
              </tr>
            ) : (
              rows.map((r) => (
                <tr
                  key={r._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="p-2 border">{r.serviceNo}</td>
                  <td className="p-2 border">{r.name}</td>
                  <td className="p-2 border">{r.rank}</td>
                  <td className="p-2 border">{r.trade}</td>
                  <td className="p-2 border">{r.unit}</td>
                  <td className="p-2 border">{r.phone}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
