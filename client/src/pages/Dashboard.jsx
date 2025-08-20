import Topbar from "../components/Topbar";

export default function Dashboard() {
  return (
    <div className="px-4">
      {/* Header with Topbar */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold md:block hidden">
          Company Commander Home
        </h1>
        <Topbar />
      </div>

      {/* Title */}
      <h1 className="text-center font-bold text-xl mb-6 mt-10">
        Company Commander
      </h1>

      {/* Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="p-6 rounded bg-gray-100 text-center">
          Open Dashboard
        </div>
        <div className="p-6 rounded bg-gray-100 text-center">
          Search / Browse Users
        </div>
        <div className="p-6 rounded bg-gray-100 text-center">
          Availability on Date
        </div>
      </div>
    </div>
  );
}
