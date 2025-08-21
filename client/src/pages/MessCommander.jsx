import { useEffect, useState } from "react";
import { api } from "../lib/axios";
import { motion } from "framer-motion";
import { PlusCircle, Edit, Trash2, Search, Users, Calendar } from "lucide-react";

export default function MessCommander() {
  const [meals, setMeals] = useState([]);
  const [editingMeal, setEditingMeal] = useState(null);
  const [form, setForm] = useState({
    meal_date: new Date().toISOString().split("T")[0],
    meal_type: "Lunch",
    headcount: "",
  });

  const [range, setRange] = useState("30");

  const fetchMeals = async () => {
    try {
      const res = await api.get("/meals");
      setMeals(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMeals();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        meal_date: form.meal_date,
        meal_type: form.meal_type,
        headcount: Number(form.headcount),
      };

      if (editingMeal) {
        await api.put(`/meals/${editingMeal._id}`, payload);
        setEditingMeal(null);
      } else {
        await api.post("/meals", payload);
      }

      setForm({
        meal_date: new Date().toISOString().split("T")[0],
        meal_type: "Lunch",
        headcount: "",
      });

      fetchMeals();
    } catch (err) {
      console.error("❌ AxiosError:", err.response?.data || err.message);
    }
  };

  const handleEdit = (meal) => {
    setEditingMeal(meal);
    setForm({
      meal_date: meal.meal_date.slice(0, 10),
      meal_type: meal.meal_type,
      headcount: meal.headcount,
    });
  };

  const handleDelete = async (id) => {
    await api.delete(`/meals/${id}`);
    fetchMeals();
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <motion.h2
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-bold text-2xl mb-8 text-center text-cyan-800"
      >
        🍽️ Mess — Meal Planning 
      </motion.h2>

      {/* Form Section */}
      <motion.form
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        onSubmit={handleSubmit}
        className="bg-gradient-to-r from-blue-50 to-blue-100 shadow-lg rounded-md p-6 mb-5 flex flex-wrap items-end gap-6 border border-blue-200"
      >
        <div className="flex flex-col">
          <label className="text-sm font-semibold mb-1">📅 Date</label>
          <input
            type="date"
            value={form.meal_date}
            onChange={(e) => setForm({ ...form, meal_date: e.target.value })}
            className="border border-blue-200 px-3 py-2 rounded-lg shadow-sm focus:ring-1 focus:ring-blue-400"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-semibold mb-1">🍛 Meal</label>
          <select
            value={form.meal_type}
            onChange={(e) => setForm({ ...form, meal_type: e.target.value })}
            className="border border-blue-200  px-3 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
          >
            <option>Breakfast</option>
            <option>Lunch</option>
            <option>Dinner</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-semibold mb-1">👥 Headcount</label>
          <input
            type="number"
            value={form.headcount}
            onChange={(e) => setForm({ ...form, headcount: e.target.value })}
            className="border  border-blue-200  px-3 py-2 rounded-lg shadow-sm w-28 focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <button
          type="submit"
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-xl shadow hover:bg-blue-700 transition"
        >
          <PlusCircle size={18} />
          {editingMeal ? "Update Meal" : "Add Meal"}
        </button>

   
      </motion.form>

      {/* Table Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="overflow-x-auto bg-white shadow-lg rounded-md border border-gray-100"
      >
        <table className="w-full text-sm border-collapse">
          <thead className="bg-blue-50 text-gray-700">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">Date</th>
              <th className="px-4 py-3 text-left font-semibold">Meal</th>
              <th className="px-4 py-3 text-left font-semibold">Headcount</th>
              <th className="px-4 py-3 text-left font-semibold">Created At</th>
              <th className="px-4 py-3 text-left font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {meals.map((meal) => (
              <tr
                key={meal._id}
                className="hover:bg-blue-50 transition duration-150"
              >
                <td className="px-4 py-3 flex items-center gap-2">
                  <Calendar size={14} className="text-blue-500" />
                  {meal.meal_date}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      meal.meal_type === "Breakfast"
                        ? "bg-yellow-100 text-yellow-700"
                        : meal.meal_type === "Lunch"
                        ? "bg-green-100 text-green-700"
                        : "bg-purple-100 text-purple-700"
                    }`}
                  >
                    {meal.meal_type}
                  </span>
                </td>
                <td className="px-4 py-3 flex items-center gap-2">
                  <Users size={14} className="text-gray-500" />
                  {meal.headcount}
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {new Date(meal.created_at).toLocaleString()}
                </td>
                <td className="px-4 py-3 flex gap-3">
                  <button
                    onClick={() => handleEdit(meal)}
                    className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition"
                  >
                    <Edit size={16} /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(meal._id)}
                    className="flex items-center gap-1 text-red-600 hover:text-red-800 transition"
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                </td>
              </tr>
            ))}
            {meals.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-500">
                  🚫 No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </motion.div>

      {/* Footer */}
      <p className="text-center text-sm text-gray-500 mt-8">
        ✅ Ready — Manage your mess meals smoothly
      </p>
    </div>
  );
}
