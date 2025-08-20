// // import { NavLink } from "react-router-dom";

// // const links = [
// //   { to: "/", label: "Dashboard" },
// //   { to: "/writer", label: "Writer" },
// //   { to: "/company-commander", label: "Company Commander" },
// //   { to: "/chm", label: "CHM (Duty Assign)" },
// //   { to: "/cqmh", label: "CQMH (Inventory)" },
// //   { to: "/mess", label: "Mess SO/Commander" },
// //   { to: "/back", label: "Back to Role select" },
// // ];

// // export default function Sidebar() {
// //   return (
// //     <aside className="w-64 bg-white shadow-lg h-screen p-6 flex flex-col">
// //       {/* Logo / Title */}
// //       <div className="mb-8">
// //         <h1 className="text-2xl font-bold text-cyan-700">FMS v1.0</h1>
// //         <p className="text-gray-500 text-sm mt-1">Fighter Management System</p>
// //       </div>

// //       {/* Navigation Links */}
// //       <nav className="flex-1 flex flex-col gap-2">
// //         {links.map((l) => (
// //           <NavLink
// //             key={l.to}
// //             to={l.to}
// //             className={({ isActive }) =>
// //               `flex items-center px-4 py-2 rounded-lg text-sm transition-all duration-200 font-medium ${
// //                 isActive
// //                   ? "bg-cyan-700 text-white shadow"
// //                   : "text-gray-700 hover:bg-gray-100 hover:text-cyan-800"
// //               }`
// //             }
// //           >
// //             {l.label}
// //           </NavLink>
// //         ))}
// //       </nav>

// //       {/* Optional Footer */}
// //       <div className="mt-auto text-gray-400 text-xs">
// //         © 2025 FMS. All rights reserved.
// //       </div>
// //     </aside>
// //   );
// // }


// // import { NavLink } from "react-router-dom";
// // import { Menu } from "lucide-react";
// // import { useState } from "react";

// // const links = [
// //   { to: "/", label: "Dashboard" },
// //   { to: "/writer", label: "Writer" },
// //   { to: "/company-commander", label: "Company Commander" },
// //   { to: "/chm", label: "CHM (Duty Assign)" },
// //   { to: "/cqmh", label: "CQMH (Inventory)" },
// //   { to: "/mess", label: "Mess SO/Commander" },
// //   { to: "/back", label: "Back to Role select" },
// // ];

// // export default function Sidebar() {
// //   const [open, setOpen] = useState(false);

// //   return (
// //     <>
// //       {/* Desktop Sidebar */}
// //       <aside className="hidden lg:flex w-64 bg-white shadow-lg h-screen p-6 flex-col fixed">
// //         {/* Logo / Title */}
// //         <div className="mb-8">
// //           <h1 className="text-2xl font-bold text-cyan-700">FMS v1.0</h1>
// //           <p className="text-gray-500 text-sm mt-1">
// //             Fighter Management System
// //           </p>
// //         </div>

// //         {/* Navigation Links */}
// //         <nav className="flex-1 flex flex-col gap-2">
// //           {links.map((l) => (
// //             <NavLink
// //               key={l.to}
// //               to={l.to}
// //               className={({ isActive }) =>
// //                 `flex items-center px-4 py-2 rounded-lg text-sm transition-all duration-200 font-medium ${
// //                   isActive
// //                     ? "bg-cyan-700 text-white shadow"
// //                     : "text-gray-700 hover:bg-gray-100 hover:text-cyan-800"
// //                 }`
// //               }
// //             >
// //               {l.label}
// //             </NavLink>
// //           ))}
// //         </nav>

// //         {/* Footer */}
// //         <div className="mt-auto text-gray-400 text-xs">
// //           © 2025 FMS. All rights reserved.
// //         </div>
// //       </aside>

// //       {/* Mobile Topbar */}
// //       <div className="lg:hidden fixed top-0 left-0 w-full bg-white shadow-md z-50">
// //         <div className="flex items-center justify-between px-4 py-3">
// //           <h1 className="text-lg font-bold text-cyan-700">FMS v1.0</h1>
// //           <button
// //             onClick={() => setOpen(!open)}
// //             className="p-2 rounded-md hover:bg-gray-100"
// //           >
// //             <Menu className="h-6 w-6 text-gray-700" />
// //           </button>
// //         </div>

// //         {open && (
// //           <nav className="flex flex-col gap-1 px-4 pb-4">
// //             {links.map((l) => (
// //               <NavLink
// //                 key={l.to}
// //                 to={l.to}
// //                 onClick={() => setOpen(false)}
// //                 className={({ isActive }) =>
// //                   `px-4 py-2 rounded-md text-sm font-medium ${
// //                     isActive
// //                       ? "bg-cyan-700 text-white"
// //                       : "text-gray-700 hover:bg-gray-100 hover:text-cyan-800"
// //                   }`
// //                 }
// //               >
// //                 {l.label}
// //               </NavLink>
// //             ))}
// //           </nav>
// //         )}
// //       </div>

// //       {/* Page Content Wrapper (to avoid overlap) */}
// //       <div className="lg:ml-64 pt-14 lg:pt-0">
// //         {/* Yahan pe aapka main page ka content aayega */}
// //       </div>
// //     </>
// //   );
// // }


// import { NavLink } from "react-router-dom";
// import { Menu } from "lucide-react";
// import { useState } from "react";

// const links = [
//   { to: "/", label: "Dashboard" },
//   { to: "/writer", label: "Writer" },
//   { to: "/company-commander", label: "Company Commander" },
//   { to: "/chm", label: "CHM (Duty Assign)" },
//   { to: "/cqmh", label: "CQMH (Inventory)" },
//   { to: "/mess", label: "Mess SO/Commander" },
//   { to: "/back", label: "Back to Role select" },
// ];

// export default function Sidebar() {
//   const [open, setOpen] = useState(false);

//   return (
//     <>
//       {/* Desktop Sidebar */}
//       <aside className="hidden lg:flex w-64 bg-white shadow-lg h-screen p-6 flex-col fixed">
//         {/* Logo / Title */}
//         <div className="mb-8">
//           <h1 className="text-2xl font-bold text-cyan-700">FMS v1.0</h1>
//           <p className="text-gray-500 text-sm mt-1">
//             Fighter Management System
//           </p>
//         </div>

//         {/* Navigation Links */}
//         <nav className="flex-1 flex flex-col gap-2">
//           {links.map((l) => (
//             <NavLink
//               key={l.to}
//               to={l.to}
//               className={({ isActive }) =>
//                 `flex items-center px-4 py-2 rounded-lg text-sm transition-all duration-200 font-medium ${
//                   isActive
//                     ? "bg-cyan-700 text-white shadow"
//                     : "text-gray-700 hover:bg-gray-100 hover:text-cyan-800"
//                 }`
//               }
//             >
//               {l.label}
//             </NavLink>
//           ))}
//         </nav>

//         {/* Footer */}
//         <div className="mt-auto text-gray-400 text-xs">
//           © 2025 FMS. All rights reserved.
//         </div>
//       </aside>

//       {/* Mobile Topbar */}
//       <div className="lg:hidden fixed top-0 left-0 w-full bg-white shadow-md z-50">
//         <div className="flex items-center justify-between px-4 py-3">
//           <h1 className="text-lg font-bold text-cyan-700">FMS v1.0</h1>
//           <button
//             onClick={() => setOpen(!open)}
//             className="p-2 rounded-md hover:bg-gray-100"
//           >
//             <Menu className="h-6 w-6 text-gray-700" />
//           </button>
//         </div>

//         {open && (
//           <nav className="flex flex-col gap-1 px-4 pb-4">
//             {links.map((l) => (
//               <NavLink
//                 key={l.to}
//                 to={l.to}
//                 onClick={() => setOpen(false)}
//                 className={({ isActive }) =>
//                   `px-4 py-2 rounded-md text-sm font-medium ${
//                     isActive
//                       ? "bg-cyan-700 text-white"
//                       : "text-gray-700 hover:bg-gray-100 hover:text-cyan-800"
//                   }`
//                 }
//               >
//                 {l.label}
//               </NavLink>
//             ))}
//           </nav>
//         )}
//       </div>

//       {/* Page Content Wrapper */}
//       <div className="lg:ml-64 pt-14 lg:pt-0">
//         {/* Content Routes already handle HomePage */}
//       </div>
//     </>
//   );
// }

import { NavLink } from "react-router-dom";
import { Menu, LogOut } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext.jsx";

const links = [
  { to: "/dashboard", label: "Dashboard" },
  { 
    to: "/writer", 
    label: "Writer",
    allowedRoles: ["Writer", "CompanyCommander", "CHM", "CQMH", "MessSO", "Commander", "SuperAdmin"]
  },
  // { 
  //   to: "/company-commander", 
  //   label: "Company Commander",
  //   allowedRoles: ["CompanyCommander", "Commander", "SuperAdmin"]
  // },
  { 
    to: "/chm", 
    label: "CHM (Duty Assign)",
    allowedRoles: ["CHM", "CompanyCommander", "Commander", "SuperAdmin"]
  },
  { 
    to: "/cqmh", 
    label: "CQMH (Inventory)",
    allowedRoles: ["CQMH", "CompanyCommander", "Commander", "SuperAdmin"]
  },
  { 
    to: "/mess", 
    label: "Mess SO/Commander",
    allowedRoles: ["MessSO", "CompanyCommander", "Commander", "SuperAdmin"]
  },
  { 
    to: "/admin", 
    label: "Admin Management",
    allowedRoles: ["SuperAdmin"]
  },
  { to: "/back", label: "Back to Role select" },
];

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const { user, logout, hasRole } = useAuth();

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 bg-white shadow-lg h-screen p-6 flex-col fixed">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-cyan-700">FMS v1.0</h1>
          <p className="text-gray-500 text-sm mt-1">
            Fighter Management System
          </p>
        </div>

        {/* ✅ Desktop me Home link nhi hoga */}
        <nav className="flex-1 flex flex-col gap-2">
          {links.map((l) => {
            // Check if user has permission for this route
            const hasPermission = l.allowedRoles ? hasRole(l.allowedRoles) : true;
            
            if (!hasPermission) return null;
            
            return (
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
            );
          })}
        </nav>

        <div className="mt-auto">
          <div className="text-gray-400 text-xs mb-2">
            © 2025 FMS. All rights reserved.
          </div>
          {user && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">{user.name}</span>
              <button
                onClick={logout}
                className="p-1 text-gray-500 hover:text-red-600 transition-colors"
                title="Logout"
              >
                <LogOut size={16} />
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Mobile Topbar */}
      <div className="lg:hidden fixed top-0 left-0 w-full bg-white shadow-md z-50">
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="text-lg font-bold text-cyan-700">FMS v1.0</h1>
          <button
            onClick={() => setOpen(!open)}
            className="p-2 rounded-md hover:bg-gray-100"
          >
            <Menu className="h-6 w-6 text-gray-700" />
          </button>
        </div>

        {open && (
          <nav className="flex flex-col gap-1 px-4 pb-4">
            {/* ✅ Mobile me Home link hoga */}
            <NavLink
              to="/"
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `px-4 py-2 rounded-md text-sm font-medium ${
                  isActive
                    ? "bg-cyan-700 text-white"
                    : "text-gray-700 hover:bg-gray-100 hover:text-cyan-800"
                }`
              }
            >
          Home
            </NavLink>

            {/* Baaki links */}
            {links.map((l) => {
              const hasPermission = l.allowedRoles ? hasRole(l.allowedRoles) : true;
              
              if (!hasPermission) return null;
              
              return (
                <NavLink
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-md text-sm font-medium ${
                      isActive
                        ? "bg-cyan-700 text-white"
                        : "text-gray-700 hover:bg-gray-100 hover:text-cyan-800"
                    }`
                  }
                >
                  {l.label}
                </NavLink>
              );
            })}
          </nav>
        )}
      </div>

      {/* ✅ Page content ke liye space */}
      <div className="lg:ml-64 pt-14 lg:pt-0"></div>
    </>
  );
}
