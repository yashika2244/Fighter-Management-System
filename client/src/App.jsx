import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Sidebar from "./components/Sidebar.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import WriterHome from "./pages/Writer/WriterHome.jsx";
import FeedNewUser from "./pages/Writer/FeedNewUser.jsx";
import LookForUser from "./pages/Writer/LookForUser.jsx";
import AvailabilityOnDateModal from "./pages/Writer/AvailabilityOnDate.jsx";
import ChmPage from "./pages/ChmPage.jsx";
import CompanyCommanderPage from "./pages/CompanyCommanderPage.jsx";

function Layout(){
  return (
    <div className="flex">
      <Sidebar/>
      <main className="flex-1 min-h-screen">
        <Routes>
          <Route path="/" element={<Dashboard/>}/>
          <Route path="/writer" element={<WriterHome/>}/>
          <Route path="/writer/new" element={<FeedNewUser/>}/>
          <Route path="/writer/search" element={<LookForUser/>}/>
          <Route path="/writer/availability" element={<AvailabilityOnDateModal/>}/>
                <Route path="/chm" element={<ChmPage/>} />
                      <Route path="/company-commander" element={<CompanyCommanderPage/>} />
                          {/* <Route path="/messso" element={<MessSOPage />} /> */}
        </Routes>
      </main>
    </div>
  );
}

export default function App(){
  return <BrowserRouter><Layout/></BrowserRouter>;
}
