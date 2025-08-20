import Topbar from "../components/Topbar";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

import PageCard from "../components/PageCard";

const CompanyCommanderPage = () => {
  const nav = useNavigate();
  const [openAvailability, setOpenAvailability] = useState(false);

  return (
    <div className="px-4 sm:px-6 lg:px-8 md:py-4 py-20">
      {/* Header */}
      <div className="md:flex hidden flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-xl font-bold mb-2 sm:mb-0">Company Commander Home</h1>
        <Topbar />
      </div>

      {/* Title */}
      <h1 className="text-center font-bold text-xl mb-6 mt-6 sm:mt-10">
        Company Commander
      </h1>

      {/* Actions Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="p-6 rounded bg-gray-100 text-center cursor-pointer hover:bg-gray-200 transition">
          Open Dashboard
        </div>
        <div className="p-6 rounded bg-gray-100 text-center cursor-pointer hover:bg-gray-200 transition">
          Search / Browse Users
        </div>
        <div className="p-6 rounded bg-gray-100 text-center cursor-pointer hover:bg-gray-200 transition">
          Availability on Date
        </div>
      </div>
    </div>
  );
};

export default CompanyCommanderPage;
