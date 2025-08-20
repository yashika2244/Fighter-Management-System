// ResponsiveWrapper.jsx
import { useEffect, useState } from "react";
import Dashboard from "../pages/Dashboard";
import Home from  "../pages/HomePage"

export default function ResponsiveWrapper() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isMobile ? <Home /> : <Dashboard />;
}
