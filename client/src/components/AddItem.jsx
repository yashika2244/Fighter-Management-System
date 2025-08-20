import { useState } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AddItemModal({ isOpen, onClose, onAdd }) {
  const [form, setForm] = useState({
    name: "",
    sku: "",
    unit: "",
    qty: "",
    minQty: "",
    location: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(form);
    setForm({ name: "", sku: "", unit: "", qty: "", minQty: "", location: "" });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-lg"
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 15 }}
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-6 border-b pb-3">
              <h2 className="text-2xl font-bold text-gray-800">
                ➕ Add New Item
              </h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-red-600 transition"
              >
                <X size={24} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {[
                { name: "name", label: "Item Name", type: "text" },
                { name: "sku", label: "SKU Code", type: "text" },
                { name: "unit", label: "Unit (e.g. pcs, kg)", type: "text" },
                { name: "qty", label: "Quantity", type: "number" },
                { name: "minQty", label: "Minimum Qty", type: "number" },
                { name: "location", label: "Location", type: "text" },
              ].map((field) => (
                <div key={field.name}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    name={field.name}
                    value={form[field.name]}
                    onChange={handleChange}
                    placeholder={field.label}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                               focus:outline-none focus:ring-2 focus:ring-blue-500 
                               focus:border-blue-500 shadow-sm"
                    required={field.name === "name" || field.name === "sku"}
                  />
                </div>
              ))}

              {/* Buttons */}
              <div className="flex justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2 rounded-lg border border-gray-300 
                             text-gray-600 hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-lg bg-blue-600 text-white 
                             font-medium hover:bg-blue-700 transition 
                             shadow-md hover:shadow-lg"
                >
                  💾 Save Item
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
