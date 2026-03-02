import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Menu, X, Tv, Search } from "lucide-react";
import AnimeSearchbar from "./AnimeSearchbar";

export default function Navbar() {
  const { isLoggedIn, handleLogout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const location = useLocation();

  useEffect(() => {
    setIsOpen(false);
    setIsSearchOpen(false);
  }, [location]);

  return (
    <>
      <nav className="sticky top-0 z-50 border-b border-[#292929] bg-[#171717] relative">
        <div className="max-w-[1520px] mx-auto px-4 md:px-[30px]">
          <div className="flex justify-between items-center py-4 min-h-[80px] w-full">
            <Link to="/" className="text-[#858585] hover:text-white transition-colors">
              <Tv size={32} />
            </Link>

            {/* Desktop Navigation */}
            <ul className="hidden md:flex gap-8 text-md items-center font-semibold text-[#858585]">
              <li>
                <AnimeSearchbar />
              </li>
              {isLoggedIn ? (
                <>
                  <li className="hover:underline hover:text-white transition-colors">
                    <Link to="/profile/">Profile</Link>
                  </li>
                  <li>
                    <button 
                      className="hover:underline hover:text-white cursor-pointer transition-colors" 
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li className="hover:underline hover:text-white transition-colors">
                    <Link to="/login/">Login</Link>
                  </li>
                  <li className="hover:underline hover:text-white transition-colors">
                    <Link to="/register/">Register</Link>
                  </li>
                </>
              )}
            </ul>

            {/* Mobile Action Buttons */}
            <div className="md:hidden flex items-center gap-5">
              <button
                className="text-[#858585] hover:text-white focus:outline-none transition-colors"
                onClick={() => {
                  setIsSearchOpen(true);
                  setIsOpen(false);
                }}
                aria-label="Open search"
              >
                <Search size={26} />
              </button>

              <button
                className="text-[#858585] hover:text-white focus:outline-none transition-colors"
                onClick={() => {
                  setIsOpen(!isOpen);
                  setIsSearchOpen(false);
                }}
                aria-label={isOpen ? "Close menu" : "Open menu"}
              >
                {isOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isOpen && (
          <div className="md:hidden absolute top-full left-0 w-full border-b border-gray-700 bg-[#171717] shadow-2xl">
            <ul className="flex flex-col items-center gap-6 py-6 text-lg text-[#858585]">
              <li className="hover:underline hover:text-white transition-colors">
                <Link to="/">Home</Link>
              </li>

              {isLoggedIn ? (
                <>
                  <li className="hover:underline hover:text-white transition-colors">
                    <Link to="/profile/">Profile</Link>
                  </li>
                  <li>
                    <button
                      className="hover:underline hover:text-white cursor-pointer transition-colors"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li className="hover:underline hover:text-white transition-colors">
                    <Link to="/login/">Login</Link>
                  </li>
                  <li className="hover:underline hover:text-white transition-colors">
                    <Link to="/register/">Register</Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        )}
      </nav>
      
      {isSearchOpen && (
        <div 
          className="md:hidden fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex justify-center items-start pt-20 px-4"
          onClick={() => setIsSearchOpen(false)}
        >
          <div 
            className="w-full max-w-[320px] bg-[#171717] border border-[#292929] rounded-xl shadow-2xl p-4 animate-in fade-in slide-in-from-top-4 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4 px-1">
              <span className="text-[#858585] font-semibold text-sm">Search Anime</span>
              <button
                className="text-[#858585] hover:text-white focus:outline-none transition-colors"
                onClick={() => setIsSearchOpen(false)}
                aria-label="Close search"
              >
                <X size={20} />
              </button>
            </div>
            <AnimeSearchbar />
          </div>
        </div>
      )}
    </>
  );
}