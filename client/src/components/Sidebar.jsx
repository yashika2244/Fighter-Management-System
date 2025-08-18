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
    <aside className="w-64 bg-gray-100 shadow-md h-screen p-5">
      {/* Logo / Title */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-cyan-800">FMS v1.0</h1>
        <p className="text-gray-500 text-sm">Fighter Management System</p>
      </div>

      {/* Navigation Links */}
      <nav className="space-y-3">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            className={({ isActive }) =>
              `block px-4  py-2 rounded-sm transition-colors duration-200 text-sm ${
                isActive
                  ? "bg-gray-300 text-black font-medium"
                  : "text-gray-700 hover:bg-gray-200"
              }`
            }
          >
            {l.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
