import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Register the required components
ChartJS.register(ArcElement, Tooltip, Legend);

const InvestmentPage = () => {
  const [investments, setInvestments] = useState([]);
  const [newInvestment, setNewInvestment] = useState({
    assetName: "",
    type: "",
    quantity: "",
    purchasePrice: "",
    currentPrice: "",
  });
  const [editingInvestmentId, setEditingInvestmentId] = useState(null);

  // Fetch investments from the backend
  useEffect(() => {
    const fetchInvestments = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found, user might not be logged in.");
        return;
      }

      try {
        const response = await fetch("http://localhost:8000/investments", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch investments");
        }

        const data = await response.json();
        if (Array.isArray(data.investments)) {
          setInvestments(data.investments);
        } else {
          console.error("Investments is not an array:", data.investments);
          setInvestments([]);
        }
      } catch (error) {
        console.error("Error fetching investments:", error);
        setInvestments([]);
      }
    };

    fetchInvestments();
  }, []);

  // Function to add a new investment
  const addInvestment = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    try {
      const response = await fetch("http://localhost:8000/investments", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          assetName: newInvestment.assetName,
          type: newInvestment.type,
          quantity: parseInt(newInvestment.quantity) || 0,
          purchasePrice: parseFloat(newInvestment.purchasePrice) || 0,
          currentPrice: parseFloat(newInvestment.currentPrice) || 0,
        }),
      });

      if (!response.ok) throw new Error("Failed to add investment");

      const data = await response.json();
      setInvestments((prev) => [...prev, data]);

      // Reset newInvestment state
      setNewInvestment({
        assetName: "",
        type: "",
        quantity: "",
        purchasePrice: "",
        currentPrice: "",
      });
    } catch (error) {
      console.error(error);
      alert("Error adding investment");
    }
  };

  // Function to handle editing an investment
  const handleEditInvestment = (investment) => {
    setEditingInvestmentId(investment._id);
    setNewInvestment(investment);
  };

  
  // Function to delete an investment
  const deleteInvestment = async (id) => {
    const token = localStorage.getItem("token");
    
    // Confirm deletion
    if (!window.confirm("Are you sure you want to delete this investment?")) {
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:8000/investments/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error("Failed to delete investment");
      }
  
      // Update state to remove the deleted investment
      setInvestments((prev) => prev.filter((inv) => inv._id !== id));
    } catch (error) {
      console.error(error);
      alert("Error deleting investment: " + error.message);
    }
  };
  

  // Debugging: Log investments before calculations
  console.log("Investments before calculations:", investments);

  // Calculate total investment value
  const totalInvestmentValue = investments.reduce((acc, inv) => {
    if (
      inv &&
      typeof inv === "object" &&
      inv.currentPrice != null &&
      inv.quantity != null
    ) {
      const currentValue = inv.currentPrice || 0;
      const quantity = inv.quantity || 0;
      return acc + currentValue * quantity;
    }
    console.warn("Invalid investment object:", inv);
    return acc;
  }, 0);

  // Calculate total gain/loss
  const totalGainLoss = investments.reduce((acc, inv) => {
    if (
      inv &&
      typeof inv === "object" &&
      inv.currentPrice != null &&
      inv.purchasePrice != null &&
      inv.quantity != null
    ) {
      const currentPrice = inv.currentPrice || 0;
      const purchasePrice = inv.purchasePrice || 0;
      const quantity = inv.quantity || 0;
      return acc + quantity * (currentPrice - purchasePrice);
    }
    console.warn("Invalid investment object for gain/loss:", inv);
    return acc;
  }, 0);

  // Prepare data for pie chart
  const calculatePieChartData = (investments) => {
    // Initialize your pie chart data structure
    const data = {
      labels: [],
      datasets: [
        {
          data: [],
          backgroundColor: [], // Add colors if needed
        },
      ],
    };

    investments.forEach((inv) => {
      if (inv && inv.quantity > 0) {
        // Only consider valid investments
        data.labels.push(inv.assetName);
        data.datasets[0].data.push(inv.quantity); // or any other metric you want to visualize
        data.datasets[0].backgroundColor.push("#FF6384"); // Add your colors
      } else {
        console.warn("Invalid investment object for pie chart:", inv);
      }
    });

    return data;
  };

  // Inside your component
  const pieChartData = calculatePieChartData(investments);
  console.log("Investments state:", investments);

  return (
    <div className="flex flex-col p-8 bg-indigo-950 rounded-2xl text-white">
      <h1 className="text-3xl mb-6">Investment Overview</h1>

      {/* Investment Form */}
      <form onSubmit={addInvestment} className="mb-6">
        <h2 className="text-2xl mb-4">{editingInvestmentId ? "Edit Investment" : "Add New Investment"}</h2>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Asset Name"
            value={newInvestment.assetName}
            onChange={(e) =>
              setNewInvestment({ ...newInvestment, assetName: e.target.value })
            }
            className="p-2 rounded bg-gray-700"
            required
          />
          <input
            type="text"
            placeholder="Type (e.g., Stock, Bond)"
            value={newInvestment.type}
            onChange={(e) =>
              setNewInvestment({ ...newInvestment, type: e.target.value })
            }
            className="p-2 rounded bg-gray-700"
            required
          />
          <input
            type="number"
            placeholder="Quantity"
            value={newInvestment.quantity}
            onChange={(e) =>
              setNewInvestment({ ...newInvestment, quantity: e.target.value })
            }
            className="p-2 rounded bg-gray-700"
            required
          />
          <input
            type="number"
            step="0.01"
            placeholder="Purchase Price"
            value={newInvestment.purchasePrice}
            onChange={(e) =>
              setNewInvestment({
                ...newInvestment,
                purchasePrice: e.target.value,
              })
            }
            className="p-2 rounded bg-gray-700"
            required
          />
          <input
            type="number"
            step="0.01"
            placeholder="Current Price"
            value={newInvestment.currentPrice}
            onChange={(e) =>
              setNewInvestment({
                ...newInvestment,
                currentPrice: e.target.value,
              })
            }
            className="p-2 rounded bg-gray-700"
            required
          />
        </div>
        <button type="submit" className="mt-4 bg-blue-500 p-2 rounded">
          {editingInvestmentId ? "Update Investment" : "Add Investment"}
        </button>
      </form>

      {/* Investment Overview */}
      <div className="mb-6">
        <h2 className="text-2xl mb-4">Summary</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 bg-gray-700 rounded-lg">
            <h3 className="text-lg">Total Investment Value</h3>
            <p className="text-2xl">&#8377;{totalInvestmentValue.toFixed(2)}</p>
          </div>
          <div className="p-4 bg-gray-700 rounded-lg">
            <h3 className="text-lg">Current Returns</h3>
            <p className="text-2xl">&#8377;{totalGainLoss.toFixed(2)}</p>
          </div>
          <div className="p-4 bg-gray-700 rounded-lg">
            <h3 className="text-lg">Investment Allocation</h3>
            <div className="h-48">
              <Pie data={pieChartData} />
            </div>
          </div>
        </div>
      </div>

      {/* Investment Portfolio */}
      <h2 className="text-2xl mb-4">Investment Portfolio</h2>
      <table className="min-w-full bg-gray-700 rounded-lg">
        <thead>
          <tr>
            <th className="py-2 px-4">Asset Name</th>
            <th className="py-2 px-4">Type</th>
            <th className="py-2 px-4">Quantity</th>
            <th className="py-2 px-4">Purchase Price</th>
            <th className="py-2 px-4">Current Price</th>
            <th className="py-2 px-4">Total Value</th>
            <th className="py-2 px-4">Gain/Loss</th>
            <th className="py-2 px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {investments.length === 0 ? (
            <tr>
              <td colSpan="8" className="py-2 px-4 text-center">
                No investments available.
              </td>
            </tr>
          ) : (
            investments.map((inv, index) => {
              if (!inv) {
                console.warn("Investment is undefined at index:", index);
                return (
                  <tr key={index} className="hover:bg-gray-600">
                    <td colSpan="8" className="py-2 px-4 text-center">
                      Invalid investment data
                    </td>
                  </tr>
                );
              }
              const totalValue = (inv.quantity || 0) * (inv.currentPrice || 0);
              const gainLoss =
                (inv.currentPrice || 0 - inv.purchasePrice || 0) *
                (inv.quantity || 0);
              return (
                <tr key={index} className="hover:bg-gray-600">
                  <td className="py-2 px-4">{inv.assetName}</td>
                  <td className="py-2 px-4">{inv.type}</td>
                  <td className="py-2 px-4">{inv.quantity || 0}</td>
                  <td className="py-2 px-4">
                    ${(inv.purchasePrice || 0).toFixed(2)}
                  </td>
                  <td className="py-2 px-4">
                    ${(inv.currentPrice || 0).toFixed(2)}
                  </td>
                  <td className="py-2 px-4">&#8377;{totalValue.toFixed(2)}</td>
                  <td className="py-2 px-4">&#8377;{gainLoss.toFixed(2)}</td>
                  <td className="py-2 px-4">
                    <button
                      onClick={() => deleteInvestment(inv._id)}
                      className="bg-red-500 p-2 rounded "
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default InvestmentPage;