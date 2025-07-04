import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import IncomeOutcome from "./IncomeOutcome";
import Analytics from "./Analytics";
import Transactions from "./Transactions";
import CardDetails from "./CardDetails";
import Activity from "./Activity";
import Expenses from "./Expenses";
import Savings from "./Savings";
import Investments from "./Investments";
import BankAccount from "./BankAccount";

const Dashboard = ({ user }) => {
  const [activeComponent, setActiveComponent] = useState("Dashboard");
  const [totalIncome, setTotalIncome] = useState(0);
  const [balance, setBalance] = useState(0); // Will be fetched from backend
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const name = localStorage.getItem("name");

  // ✅ Load income + balance from backend
  useEffect(() => {
  const fetchTotalIncomeAndBalance = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No token found. Please log in.");
      return;
    }

    try {
      setLoading(true);

      const [incomeRes, balanceRes] = await Promise.all([
        fetch(`${process.env.REACT_APP_API_URL}/total-income`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${process.env.REACT_APP_API_URL}/balance`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      // 🔐 Handle token expiration (401)
      if (incomeRes.status === 401 || balanceRes.status === 401) {
        alert("Session expired. Please login again.");
        localStorage.removeItem("token");
        window.location.href = "/login";
        return;
      }

      if (!incomeRes.ok || !balanceRes.ok) {
        throw new Error("Failed to fetch income or balance");
      }

      const incomeData = await incomeRes.json();
      const balanceData = await balanceRes.json();

      setTotalIncome(incomeData.totalIncome);
      setBalance(balanceData.balance || 0);
    } catch (error) {
      console.error(error);
      setError("Something went wrong while fetching data");
    } finally {
      setLoading(false);
    }
  };

  fetchTotalIncomeAndBalance();
}, []);


  const renderComponent = () => {
    switch (activeComponent) {
      case "Dashboard":
        return (
          <div>
            <header className="text-2xl sm:text-3xl mb-6 font-semibold">
              <h1>Welcome back, {name}</h1>
            </header>

            <div className="main flex flex-col lg:flex-row gap-6">
              {/* Left Column */}
              <div className="w-full lg:w-2/3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {loading ? (
                    <div>Loading...</div>
                  ) : (
                    <>
                      {error ? (
                        <div className="text-red-500">{error}</div>
                      ) : (
                        <IncomeOutcome type="Income" amount="₹500" />
                      )}
                      <IncomeOutcome type="Outcome" amount="₹200" />
                    </>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-6">
                  <Analytics />
                  <Transactions />
                </div>
              </div>

              {/* Right Column */}
              <div className="w-full lg:w-1/3 flex flex-col gap-6">
                <CardDetails balance={balance} setBalance={setBalance} />
                <Activity />
              </div>
            </div>
          </div>
        );

      case "Expenses":
        return <Expenses setBalance={setBalance} balance={balance} />;
      case "Savings":
        return <Savings />;
      case "Investments":
        return <Investments />;
      case "BankAccount":
        return <BankAccount />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-white text-black dark:bg-gray-900 dark:text-white transition-colors duration-300">
      <Sidebar setActiveComponent={setActiveComponent} />
      <main className="w-full lg:w-4/5 p-4 sm:p-6 md:p-8">{renderComponent()}</main>
    </div>
  );
};

export default Dashboard;
