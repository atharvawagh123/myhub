import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../api/Authcontext"
import { useNavigate } from "react-router-dom";


const Navbar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const { logout, token, isLoggedIn } = useAuth()
  
  
  const logoutfunction = () => {
    const response = logout();
    if (response) {
      navigate("/login");
      window.location.reload();
      console.log("Logout successful");
    } else {
      console.error("Logout failed");
    }
    setIsOpen(false);
  }

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-white  w-full z-50 top-0 left-0">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <h1 className="text-2xl font-bold text-blue-600">MySite</h1>

        {/* Desktop Links */}
        <ul className="hidden md:flex space-x-6 items-center">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "text-blue-600 font-bold" : "text-gray-700"
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              isActive ? "text-blue-600 font-bold" : "text-gray-700"
            }
          >
            Profile
          </NavLink>
          <NavLink
            to="/search"
            className={({ isActive }) =>
              isActive ? "text-blue-600 font-bold" : "text-gray-700"
            }
          >
            Search
          </NavLink>
          {isLoggedIn ? (
            <button
              onClick={logoutfunction}
              className="bg-red-900 text-white py-2 px-4 rounded  hover:bg-red-500 transition duration-300"
            >
              Logout
            </button>
          ) : (
            <>
              <Link to="/login" className="hover:text-blue-500">
                Login
              </Link>
              <Link to="/register" className="hover:text-blue-500 ml-4">
                Sign up
              </Link>
            </>
          )}
        </ul>

        {/* Hamburger Icon */}
        <div className="md:hidden">
          <button onClick={toggleNavbar}>
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Sidebar Menu */}
      <div
        className={`fixed top-0 left-0 w-2/3 h-full bg-white shadow-md transition-transform duration-300 z-40 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 pt-6">
          <h2 className="text-xl font-bold text-blue-600 mb-6">Menu</h2>
          <ul className="space-y-4">
            <li>
              <NavLink
                to="/"
                onClick={toggleNavbar}
                className={({ isActive }) =>
                  isActive
                    ? "text-blue-600 font-bold block"
                    : "text-gray-700 block hover:text-blue-500"
                }
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/profile"
                onClick={toggleNavbar}
                className={({ isActive }) =>
                  isActive
                    ? "text-blue-600 font-bold block"
                    : "text-gray-700 block hover:text-blue-500"
                }
              >
                Profile
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/search"
                onClick={toggleNavbar}
                className={({ isActive }) =>
                  isActive
                    ? "text-blue-600 font-bold block"
                    : "text-gray-700 block hover:text-blue-500"
                }
              >
                Search
              </NavLink>
            </li>
            {isLoggedIn ? (
              <button
                onClick={logoutfunction}
                className="bg-red-900 text-white py-2 px-4 rounded  hover:bg-red-500 transition duration-300"
              >
                Logout
              </button>
            ) : (
              <>
                <Link to="/login" className="hover:text-blue-500">
                  Login
                </Link>
                <Link to="/register" className="hover:text-blue-500 ml-4">
                  Sign up
                </Link>
              </>
            )}
          </ul>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-30 z-30"
          onClick={toggleNavbar}
        ></div>
      )}
    </nav>
  );
};

export default Navbar;
