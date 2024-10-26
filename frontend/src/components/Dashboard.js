import React, { useState } from "react";
import Sidebar from "./Sidebar";
import IncomeOutcome from "./IncomeOutcome";
import Analytics from "./Analytics";
import Transactions from "./Transactions";
import CardDetails from "./CardDetails";
import Activity from "./Activity";
import Expenses from "./Expenses";
import Savings from "./Savings";
import Investments from "./Investments";

const Dashboard = () => {
  const [activeComponent, setActiveComponent] = useState("Dashboard");

  const renderComponent = () => {
    switch (activeComponent) {
      case "Dashboard":
        return (
          <div>
            <header className="text-3xl mb-6">Welcome Back, Ali 👋</header>
            <div className="main flex">
              <div className="1 wd-40">
                <div className=" first grid grid-cols-2 gap-6 mb-6 ">
                  <IncomeOutcome type="Income" amount="$632,000" />
                  <IncomeOutcome type="Outcome" amount="$632,000" />
                </div>
                <div className="grid grid-row-2 gap-6">
                  <Analytics />
                  <Transactions />
                </div>
              </div>
              <div className="2 flex flex-col p-10 gap-10 ">
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
      default:
        return null;
    }
  };

  return (
    <div className="flex  px-2">
      <Sidebar setActiveComponent={setActiveComponent} />
      <div className="w-4/5 p-8  ">
        {renderComponent()}
      </div>
    </div>
  );
};

export default Dashboard;
