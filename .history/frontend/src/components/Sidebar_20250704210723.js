import React, { useState, useEffect } from "react";
import dashboardIcon from "../assets/dashboardIcon.svg";
import analysisIcon from "../assets/analysisIcon.svg";
import savingIcon from "../assets/savingIcon.svg";
import investmentIcon from "../assets/investmentIcon.svg";
import bank from "../assets/bank.svg";
import siteIcon from "../assets/siteIcon.svg";
import logout from "../assets/logout.svg";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react"; // Close icon

const Sidebar = ({
  setActiveComponent,
  setUser,
  setIsAuthenticated,
  sidebarOpen,
  setSidebarOpen,
}) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    setUser(null);
    setIsAuthenticated(false);
    setSidebarOpen(false);
    navigate("/"); // redirect to login
  };

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) {
      setIsDarkMode(storedTheme === "dark");
      document.documentElement.classList.toggle("dark", storedTheme === "dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkMode ? "dark" : "light";
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    localStorage.setItem("theme", newTheme);
  };

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed top-0 left-0 h-full bg-indigo-950 text-white z-50
          w-64 p-6 transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:relative lg:translate-x-0 lg:w-1/5 lg:p-4 lg:mt-4 lg:min-h-screen
        `}
      >
        {/* Close button for mobile */}
        <div className="flex justify-between items-center mb-6 lg:hidden">
          <div className="text-xl font-bold">Menu</div>
          <button onClick={() => setSidebarOpen(false)}>
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Header logo + name */}
        <div className="flex items-center space-x-3 mb-10">
          <img
            src={siteIcon}
            alt="Site Logo"
            className="w-10 h-10 sm:w-11 sm:h-11"
          />
          <div className="text-lg sm:text-xl md:text-2xl font-semibold leading-snug">
            {/* Responsive app name */}
            <span className="block md:hidden">PFM</span>
            <span className="hidden md:block">Personal Finance Manager</span>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="w-full">
          <ul className="space-y-6 text-base">
            {[
              { name: "Dashboard", icon: dashboardIcon },
              { name: "Expenses", icon: analysisIcon },
              { name: "Savings", icon: savingIcon },
              { name: "Investments", icon: investmentIcon },
              { name: "Bank Account", icon: bank },
            ].map((item) => (
              <li key={item.name}>
                <button
                  onClick={() => {
                    setActiveComponent(item.name);
                    setSidebarOpen(false); // close drawer on mobile
                  }}
                  className="flex items-center w-full hover:bg-blue-500 px-4 py-2 rounded-md"
                >
                  <img
                    src={item.icon}
                    alt={`${item.name}Icon`}
                    className="w-6 h-6 mr-3 bg-white rounded"
                  />
                  {item.name}
                </button>
              </li>
            ))}

            <li>
              <button
                onClick={handleLogout}
                className="flex items-center w-full text-left px-4 py-2 mt-2 hover:bg-red-600 rounded-md"
              >
                <img
                  src={logout}
                  alt="logoutIcon"
                  className="w-6 h-6 mr-3 bg-white rounded"
                />
                Logout
              </button>
            </li>

            <li>
              <button
                onClick={toggleTheme}
                className="py-2 px-4 w-full text-center bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-md transition-colors mt-2"
              >
                {isDarkMode ? "Light Mode" : "Dark Mode"}
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
