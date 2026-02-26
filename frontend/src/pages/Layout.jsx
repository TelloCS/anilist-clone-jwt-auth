import React from "react";
import { Outlet, Link } from "react-router-dom";
import { useAuth } from "./AuthProvider";

export default function Layout() {
    const {isLoggedIn, handleLogout } = useAuth();

    return (
        <div className="bg-[#0D1821] min-h-screen text-white">
            <nav className="border-b border-gray-700">
                <ul className="flex justify-end pt-4 pb-4 pr-16 pl-16 gap-8 text-lg">
                        <li>
                            <Link to="/">Home</Link>
                        </li>
                    {isLoggedIn ? (
                        <>
                            <li>
                                <Link to="/profile">Profile</Link>
                            </li>
                        </>
                    ) : (
                        <>
                            <li>
                                <Link to="/login">Login</Link>
                            </li>
                            <li>
                                <Link to="/register">Register</Link>
                            </li>
                        </>
                    )}
                </ul>
            </nav>
            <Outlet/>
        </div>
    );
}