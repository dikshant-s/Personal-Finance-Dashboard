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
  const [balance, setBalance] = useState(34929); // Initial balance
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const name = localStorage.getItem("name");

  useEffect(() => {
    const fetchTotalIncome = async () => {
      const token = localStorage.getItem("token");
      try {
        setLoading(true);
        const response = await fetch(`${process.env.REACT_APP_API_URL}/total-income`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch total income");
        }

        const data = await response.json();
        setTotalIncome(data.totalIncome);
      } catch (error) {
        console.error(error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTotalIncome();
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
                        <IncomeOutcome type="Income" amount="₹632,000" />
                      )}
                      <IncomeOutcome type="Outcome" amount="₹632,000" />
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
                <CardDetails balance={balance} />
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