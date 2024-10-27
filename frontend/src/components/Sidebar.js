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
  const navigate = useNavigate()

  const token = localStorage.getItem('token')
  const name = localStorage.getItem('name')

  const handleLogout = () => {
    localStorage.removeItem(token)
    localStorage.removeItem(name)
    navigate('/')
  }

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
    <div className="bg-indigo-950 mb-10 h-full w-1/5 text-white flex flex-col items-start p-6 rounded-2xl mt-10">
      <div className="flex justify-center mb-14 text-center items-center content-center">
        <img
          src={siteIcon}
          alt="dashboardIcon"
          className="inline-flex align-middle w-11 h-15 mr-2"
        />
        <div className="text-3xl font-semibold">WealthWell</div>
      </div>
      <nav>
        <ul className="space-y-10 text-lg">
          <li>
            <button
              onClick={() => setActiveComponent("Dashboard")}
              className="block hover:bg-blue-500 px-3 rounded-md py-1 align-middle justify-center"
            >
              <img
                src={dashboardIcon}
                alt="dashboardIcon"
                className="inline-flex align-middle w-6 h-6 mr-2 bg-white rounded"
              />
              Dashboard
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveComponent("Expenses")}
              className="block hover:bg-blue-500 rounded-md px-3 py-1"
            >
              <img
                src={analysisIcon}
                alt="analysisIcon"
                className="inline-flex align-middle w-6 h-6 mr-2 bg-white rounded"
              />
              Expenses
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveComponent("Savings")}
              className="block hover:bg-blue-500 rounded-md px-3 py-1"
            >
              <img
                src={savingIcon}
                alt="savingIcon"
                className="inline-flex align-middle w-6 h-6 mr-2 bg-white rounded"
              />
              Savings
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveComponent("Investments")}
              className="block hover:bg-blue-500 rounded-md px-3 py-1"
            >
              <img
                src={investmentIcon}
                alt="investmentIcon"
                className="inline-flex align-middle w-6 h-6 mr-2 bg-white rounded"
              />
              Investments
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveComponent("BankAccount")} // Link to the Bank Account page
              className="block hover:bg-blue-500 rounded-md px-3 py-1"
            >
              <img
                src={bank}
                alt="investmentIcon"
                className="inline-flex align-middle w-6 h-6 mr-2 bg-white rounded"
              />

              Bank Account
            </button>
          </li>

          <li>
            <button
              onClick={() => setActiveComponent("BankAccount")} // Link to the Bank Account page
              className="block hover:bg-blue-500 rounded-md px-3 py-1"
            >
            </button>
            <button onClick={handleLogout} className="inline-flex ml-4 mb-3 align-middle">
              <img
                src={logout}
                alt="investmentIcon"
                className="w-6 h-6 mr-2 bg-white rounded"
              />
              Logout
            </button>

          </li>

          <li>
            <button
              onClick={toggleTheme}
              className="py-1 px-2 ml-2 bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-md transition-colors"
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