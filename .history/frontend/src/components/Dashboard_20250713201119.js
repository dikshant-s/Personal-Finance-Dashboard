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
import { Menu } from "lucide-react"; // or use Heroicons / FontAwesome

const Dashboard = ({ user, setUser, setIsAuthenticated }) => {
  const [activeComponent, setActiveComponent] = useState("Dashboard");
  const [totalIncome, setTotalIncome] = useState(0);
  const [balance, setBalance] = useState(0); // Will be fetched from backend
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const name = localStorage.getItem("name");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const name = localStorage.getItem("name") || "User";
    const firstName = name.split(" ")[0];
    const greetings = [
      `Hey ${firstName} 👋 Ready to crush your savings goals?`,
      `Welcome back, ${firstName}! Your money is waiting 💸`,
      `Let’s make smart moves today, ${firstName} 🧠💰`,
      `Great to see you again, ${firstName}! 🚀`,
      `You're in charge, ${firstName} — let’s build wealth! 💼`,
      `What’s the plan today, ${firstName}? Let's dominate 💪`,
      `${firstName}, the finance master is here! 👑`,
      `Time to grow that balance, ${firstName} 🌱`,
      `${firstName}, you're just one click away from control 🧾`,
      `Rise and grind, ${firstName} 💼 Let’s handle that cashflow!`,
      `Yo ${firstName}! Ready to conquer 💪`,
      `Hey ${firstName}, let's stack cash 💸`,
      `Back at it, ${firstName}! 🔥`,
      `Go get it, ${firstName}! 🚀`,
      `Let’s win the day, ${firstName}! 🏆`,
      `${firstName}, you're unstoppable 🧠`,
      `Time to shine, ${firstName}! ✨`,
      `Welcome, boss ${firstName}! 💼`,
      `Let’s slay those expenses, ${firstName}! ⚔️`,
      `Money moves time, ${firstName} 💰`,
      `Crush it today, ${firstName}! 👊`,
      `Fuel up, ${firstName} — grind mode ON 🔋`,
      `Let’s grow that bank, ${firstName} 🌱`,
      `Make it count, ${firstName}! ✅`,
      `${firstName}, you got this! 🙌`,
    ];

    const randomIndex = Math.floor(Math.random() * greetings.length);
    setGreeting(greetings[randomIndex]);
  }, []);

  // ✅ Load income + balance from backend
  useEffect(() => {
    const fetchTotalIncomeAndBalance = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        window.location.href = "/"; // Redirect to login
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
          window.location.href = "/";
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
            <h1 className="text-2xl sm:text-3xl mb-6 font-semibold">
              {greeting}
            </h1>
            <div className="lg:hidden flex items-center p-4">
              <button onClick={() => setSidebarOpen(!sidebarOpen)}>
                <Menu className="text-white w-8 h-8" />
              </button>
            </div>
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
      <Sidebar
        setActiveComponent={setActiveComponent}
        setUser={setUser}
        setIsAuthenticated={setIsAuthenticated}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      <main className="w-full lg:w-4/5 p-4 sm:p-6 md:p-8">
        {renderComponent()}
      </main>
    </div>
  );
};

export default Dashboard;
