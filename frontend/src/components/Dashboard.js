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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const name = localStorage.getItem('name');

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
            <header className="text-2xl sm:text-3xl font-semibold mb-4 sm:mb-6">
              <h1>Welcome back, {name}</h1>
            </header>
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  {loading ? (
                    <div>Loading...</div>
                  ) : (
                    <>
                      {error ? (
                        <div className="text-red-500">{error}</div>
                      ) : (
                        <IncomeOutcome type="Income" amount={`₹${totalIncome.toLocaleString()}`} />
                      )}
                      <IncomeOutcome type="Outcome" amount="₹632,000" /> {/* Optional: Make this dynamic */}
                    </>
                  )}
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <Analytics />
                  <Transactions />
                </div>
              </div>
              <div className="flex flex-col gap-4 w-full lg:w-2/5">
                <CardDetails />
                <Activity />
              </div>
            </div>
          </div>
        );
      case "Expenses":
        return <Expenses />;
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
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50">
      <Sidebar setActiveComponent={setActiveComponent} />
      <main className="flex-1 p-4 sm:p-6 md:p-8">
        {renderComponent()}
      </main>
    </div>
  );
};

export default Dashboard;
