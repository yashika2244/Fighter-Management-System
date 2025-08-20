import { useState } from "react";
import DutyAssign from "../components/DutyAssign";

const ChmPage = () => {
  const [showDutyAssign, setShowDutyAssign] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-50 to-blue-100 ">
      {/* Button to show DutyAssign */}
      {!showDutyAssign && (
        <button
          onClick={() => setShowDutyAssign(true)}
          className="px-20 py-6 text-2xl font-bold cursor-pointer  bg-gray-400 rounded-sm shadow-2xl hover:bg-gray-300  transition-transform duration-300"
        >
           Duty Assign
        </button>
      )}

      {/* DutyAssign Component */}
      {showDutyAssign && <DutyAssign />}
    </div>
  );
};

export default ChmPage;
