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
        const response = await fetch(`http://localhost:8000/total-income`, {
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
            <header className="text-3xl mb-6">
              <h1>Welcome back, {name}</h1>
            </header>
            <div className="main flex">
              <div className="1 wd-40">
                <div className="first grid grid-cols-2 gap-6 mb-6">
                  {loading ? (
                    <div>Loading...</div>
                  ) : (
                    <>
                      {error ? (
                        <div className="error">{error}</div>
                      ) : (
                        <IncomeOutcome type="Income" amount="$632,000"/>
                      )}
                      <IncomeOutcome type="Outcome" amount="$632,000" /> {/* Consider making this dynamic */}
                    </>
                  )}
                </div>
                <div className="grid grid-row-2 gap-6">
                  <Analytics />
                  <Transactions />
                </div>
              </div>
              <div className="2 flex flex-col pl-12 justify-center gap-10">
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
        return <BankAccount/>
      default:
        return null;
    }
  };

  return (
    <div className="flex px-2">
      <Sidebar setActiveComponent={setActiveComponent} />
      <div className="w-4/5 p-8">
        {renderComponent()}
      </div>
    </div>
  );
};

export default Dashboard;
