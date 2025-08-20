import { Users, LayoutDashboard, Shield, Plane } from "lucide-react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col  items-center justify-center bg-gradient-to-br from-slate-900 via-cyan-900 to-slate-800 text-white px-6">
      {/* Header */}
      <div className="text-center  py-20">
        <div className="flex items-center justify-center gap-3">
          <Shield className="h-12 w-12 text-cyan-400 drop-shadow-lg" />
          <h1 className="text-4xl font-extrabold tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-cyan-500">
            Fighter Management System
          </h1>
        </div>
        <p className="text-gray-300 mt-3 text-sm sm:text-base">
          FMS v1.0 – Streamline and manage your operations effectively
        </p>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-6 w-full max-w-lg">
        <Link
          to="/dashboard"
          className="group flex flex-col items-center justify-center p-8 rounded-2xl backdrop-blur-md bg-white/10 border border-white/20 shadow-lg hover:bg-cyan-600/20 hover:scale-105 transition-all duration-300"
        >
          <LayoutDashboard className="h-10 w-10 text-cyan-300 group-hover:text-cyan-400 mb-3" />
          <span className="text-sm font-semibold">Dashboard</span>
        </Link>

        <Link
          to="/writer"
          className="group flex flex-col items-center justify-center p-8 rounded-2xl backdrop-blur-md bg-white/10 border border-white/20 shadow-lg hover:bg-cyan-600/20 hover:scale-105 transition-all duration-300"
        >
          <Users className="h-10 w-10 text-cyan-300 group-hover:text-cyan-400 mb-3" />
          <span className="text-sm font-semibold">Writer</span>
        </Link>

        <Link
          to="/chm"
          className="group flex flex-col items-center justify-center p-8 rounded-2xl backdrop-blur-md bg-white/10 border border-white/20 shadow-lg hover:bg-cyan-600/20 hover:scale-105 transition-all duration-300"
        >
          <Plane className="h-10 w-10 text-cyan-300 group-hover:text-cyan-400 mb-3" />
          <span className="text-sm font-semibold">CHM</span>
        </Link>

        <Link
          to="/company-commander"
          className="group flex flex-col items-center justify-center p-8 rounded-2xl backdrop-blur-md bg-white/10 border border-white/20 shadow-lg hover:bg-cyan-600/20 hover:scale-105 transition-all duration-300"
        >
          <Shield className="h-10 w-10 text-cyan-300 group-hover:text-cyan-400 mb-3" />
          <span className="text-sm font-semibold">Commander</span>
        </Link>
      </div>

      {/* Footer */}
      <p className="mt-12 text-xs text-gray-400 tracking-wide">
        © {new Date().getFullYear()} Fighter Management System v1.0
      </p>
    </div>
  );
}
