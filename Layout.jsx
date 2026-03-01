import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Layout() {
  return (
    <div className="bg-[#0D1821] min-h-screen text-white">
      <Navbar />
      <Outlet />
    </div>
  );
}