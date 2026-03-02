import { Outlet, useLocation, Navigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Layout() {
  const location = useLocation();

  if (location.pathname.length > 1 && !location.pathname.endsWith('/')) {
    return <Navigate to={`${location.pathname}/${location.search}${location.hash}`} replace />;
  }

  return (
    <div className="bg-[#171717] min-h-screen text-white font-mono">
      <Navbar />
      <Outlet />
    </div>
  );
}