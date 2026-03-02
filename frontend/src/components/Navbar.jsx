import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Menu, X, Tv } from "lucide-react";

export default function Navbar() {
  const { isLoggedIn, handleLogout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-[#292929] bg-[#171717]">
      <div className="max-w-[1520px] mx-auto px-4 md:px-[30px]">
        <div className="flex justify-between items-center py-4 min-h-[80px] w-full">
            <Link to="/" className="text-[#858585] hover:text-white">
              <Tv size={32} />
            </Link>

            <ul className="hidden md:flex gap-8 text-md items-center font-semibold">
              {isLoggedIn ? (
                <>
                  <li className="text-[#858585] hover:underline active hover:text-white">
                    <Link to="/profile/">Profile</Link>
                  </li>
                  <li>
                    <button className="text-[#858585] hover:underline hover:text-white cursor-pointer" onClick={handleLogout}>Logout</button>
                  </li>
                </>
              ) : (
                <>
                  <li className="text-[#858585] hover:underline hover:text-white">
                    <Link to="/login/">Login</Link>
                  </li>
                  <li className="text-[#858585] hover:underline hover:text-white">
                    <Link to="/register/">Register</Link>
                  </li>
                </>
              )}
            </ul>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-[#858585] focus:outline-none"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-gray-700 bg-[#171717]">
          <ul className="flex flex-col items-center gap-6 py-8 text-lg">
            <li className="hover:underline">
              <Link to="/" onClick={() => setIsOpen(false)}>Home</Link>
            </li>
            {isLoggedIn ? (
              <>
                <li className="hover:underline">
                  <Link to="/profile/" onClick={() => setIsOpen(false)}>Profile</Link>
                </li>
                <li>
                  <button
                    className="hover:underline cursor-pointer"
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="hover:underline">
                  <Link to="/login/" onClick={() => setIsOpen(false)}>Login</Link>
                </li>
                <li className="hover:underline">
                  <Link to="/register/" onClick={() => setIsOpen(false)}>Register</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
}