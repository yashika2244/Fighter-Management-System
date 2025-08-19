import { NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Dashboard" },
  { to: "/writer", label: "Writer" },
  { to: "/company-commander", label: "Company Commander" },
  { to: "/chm", label: "CHM (Duty Assign)" },
  { to: "/cqmh", label: "CQMH (Inventory)" },
  { to: "/mess", label: "Mess SO/Commander" },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white shadow-lg h-screen p-6 flex flex-col">
      {/* Logo / Title */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-cyan-700">FMS v1.0</h1>
        <p className="text-gray-500 text-sm mt-1">Fighter Management System</p>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 flex flex-col gap-2">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            className={({ isActive }) =>
              `flex items-center px-4 py-2 rounded-lg text-sm transition-all duration-200 font-medium ${
                isActive
                  ? "bg-cyan-700 text-white shadow"
                  : "text-gray-700 hover:bg-gray-100 hover:text-cyan-800"
              }`
            }
          >
            {l.label}
          </NavLink>
        ))}
      </nav>

      {/* Optional Footer */}
      <div className="mt-auto text-gray-400 text-xs">
        © 2025 FMS. All rights reserved.
      </div>
    </aside>
  );
}
