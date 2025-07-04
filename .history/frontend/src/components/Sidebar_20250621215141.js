import React, { useState, useEffect } from "react";
import dashboardIcon from "../assets/dashboardIcon.svg";
import analysisIcon from "../assets/analysisIcon.svg";
import savingIcon from "../assets/savingIcon.svg";
import investmentIcon from "../assets/investmentIcon.svg";
import bank from "../assets/bank.svg";
import siteIcon from "../assets/siteIcon.svg";
import logout from "../assets/logout.svg";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ setActiveComponent }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const name = localStorage.getItem("name");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    navigate("/");
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
    <div className="bg-indigo-950 min-h-screen w-full md:w-1/3 lg:w-1/4 xl:w-1/5 text-white flex flex-col items-start p-4 sm:p-6 rounded-2xl mt-4 md:mt-10">
      <div className="flex justify-center mb-14 text-center items-center w-full">
        <img
          src={siteIcon}
          alt="dashboardIcon"
          className="inline-flex align-middle w-11 h-11 mr-2"
        />
        <div className="text-lg sm:text-xl md:text-2xl font-semibold leading-snug text-left break-words max-w-[140px] sm:max-w-[160px] md:max-w-full">
          Personal<span className="hidden sm:inline">Finance</span>Manager
        </div>
      </div>
      <nav className="w-full">
        <ul className="space-y-6 sm:space-y-10 text-base sm:text-lg w-full">
          <li>
            <button
              onClick={() => setActiveComponent("Dashboard")}
              className="flex items-center w-full hover:bg-blue-500 px-4 py-2 rounded-md"
            >
              <img
                src={dashboardIcon}
                alt="dashboardIcon"
                className="w-6 h-6 mr-3 bg-white rounded"
              />
              Dashboard
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveComponent("Expenses")}
              className="flex items-center w-full hover:bg-blue-500 px-4 py-2 rounded-md"
            >
              <img
                src={analysisIcon}
                alt="analysisIcon"
                className="w-6 h-6 mr-3 bg-white rounded"
              />
              Expenses
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveComponent("Savings")}
              className="flex items-center w-full hover:bg-blue-500 px-4 py-2 rounded-md"
            >
              <img
                src={savingIcon}
                alt="savingIcon"
                className="w-6 h-6 mr-3 bg-white rounded"
              />
              Savings
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveComponent("Investments")}
              className="flex items-center w-full hover:bg-blue-500 px-4 py-2 rounded-md"
            >
              <img
                src={investmentIcon}
                alt="investmentIcon"
                className="w-6 h-6 mr-3 bg-white rounded"
              />
              Investments
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveComponent("BankAccount")}
              className="flex items-center w-full hover:bg-blue-500 px-4 py-2 rounded-md"
            >
              <img
                src={bank}
                alt="bankIcon"
                className="w-6 h-6 mr-3 bg-white rounded"
              />
              Bank Account
            </button>
          </li>

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
  );
};

export default Sidebar;
