import Topbar from "../components/Topbar";

const CompanyCommanderPage = () => {
  return (
      <div className="px-4">
        <div className="flex justify-between items-center
        ">
        <h1 className="text-xl  font-bold ">Company Commander Home</h1>
        <Topbar/>
  
  
        </div>
        <h1 className="text-center font-bold text-xl mb-6 mt-10"> Company Commander</h1>
        <div className="grid grid-cols-3 gap-4">
          <div className="p-6 rounded bg-gray-100 text-center ">Open Dashboard</div>
          <div className="p-6 rounded bg-gray-100 text-center " >Search /Browser Users</div>
          <div className="p-6 rounded bg-gray-100 text-center ">Availability on Date</div>
        </div>
      </div>
  )

};
export default CompanyCommanderPage;
