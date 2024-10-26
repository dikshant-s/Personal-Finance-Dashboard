import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Savings = () => {
    const [goals, setGoals] = useState([]);
    const [amountsToAdd, setAmountsToAdd] = useState({});
    const [goalForm, setGoalForm] = useState({
        goalName: '',
        targetAmount: '',
        currentSavings: 0,
        deadline: '', // Deadline is handled as a string
        description: '',
    });
    const [contribution, setContribution] = useState({
        amount: '',
        date: '',
        goalId: '',
        recurring: false,
        interval: 'monthly'
    });
    const [error, setError] = useState('');
    const [isEditing, setIsEditing] = useState(false); // To manage editing state

    useEffect(() => {
        fetchGoals();
    }, []);

    const fetchGoals = async () => {
        try {
            const response = await fetch('http://localhost:8000/saved-goals', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const goals = await response.json();
            setGoals(goals);
        } catch (error) {
            console.error('Error fetching goals:', error);
            setError('Error fetching goals: ' + error.message);
        }
    };

    const handleGoalChange = (e) => {
        setGoalForm({ ...goalForm, [e.target.name]: e.target.value });
    };

    const handleContributionChange = (e) => {
        setContribution({ ...contribution, [e.target.name]: e.target.value });
    };

    const resetGoalForm = () => {
        setGoalForm({
            id: null,
            goalName: '',
            targetAmount: '',
            currentSavings: 0,
            deadline: '', // Reset to empty string
            description: ''
        });
        setIsEditing(false); // Reset editing state
    };

    const handleSaveGoal = async (e) => {
        e.preventDefault();
        console.log('Form Values:', goalForm);

        try {
            const response = await fetch('http://localhost:8000/saving-goals', {
                method: isEditing ? 'PUT' : 'POST', // Change method based on editing state
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(goalForm),
            });

            const data = await response.json();

            if (response.ok) {
                console.log('Savings goal saved successfully:', data);
                resetGoalForm();
                fetchGoals(); // Re-fetch goals to include the newly added one
            } else {
                console.error('Error saving savings goal:', data.message || 'Something went wrong');
                alert(data.message || 'Something went wrong');
            }
        } catch (error) {
            console.error('Network Error:', error);
            alert('Network error. Please try again later.');
        }
    };



    const handleAddSavings = (goalId) => {
        const amountToAdd = Number(amountsToAdd[goalId] || 0); // Get the amount for the specific goal
    
        if (!isNaN(amountToAdd) && amountToAdd > 0) {
            console.log('Adding savings to goal:', goalId, 'Amount:', amountToAdd);
            
            // Ensure that each goal has a unique ID and that we're targeting only the correct one
            const updatedGoals = goals.map((goal) => {
                if (goal.id === goalId) {
                    console.log('Updating goal:', goal.goalName, 'Current Savings:', goal.currentSavings, 'New Savings:', goal.currentSavings + amountToAdd);
                    return { ...goal, currentSavings: goal.currentSavings + amountToAdd };
                }
                return goal; // For other goals, return them as they are
            });
    
            setGoals(updatedGoals); // Set the updated goals array in state
            setAmountsToAdd((prev) => ({ ...prev, [goalId]: '' })); // Reset input for this goal
        }
    };
    


    const calculateProgress = (goal) => {
        const target = Number(goal.targetAmount);
        const current = Number(goal.currentSavings);
        return target > 0 ? Math.min((current / target) * 100, 100) : 0;
    };

    const chartData = {
        labels: goals.map(goal => goal.goalName),
        datasets: [
            {
                label: 'Current Savings',
                data: goals.map(goal => goal.currentSavings),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
            },
            {
                label: 'Target Amount',
                data: goals.map(goal => goal.targetAmount),
                backgroundColor: 'rgba(255, 99, 132, 0.6)',
            }
        ],
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-6">
            <h1 className="text-3xl font-semibold mb-6">Savings Goals</h1>

            {/* Set Savings Goal Section */}
            <div className="bg-gray-800 p-6 rounded-lg mb-8 shadow-lg">
                <h2 className="text-2xl font-semibold mb-4">{isEditing ? 'Edit Savings Goal' : 'Set Savings Goal'}</h2>
                <div className="grid grid-cols-2 gap-4">
                    <input
                        type="text"
                        name="goalName"
                        value={goalForm.goalName}
                        onChange={handleGoalChange}
                        placeholder="Goal Name"
                        className="p-2 rounded bg-gray-700 focus:bg-gray-600"
                    />
                    <input
                        type="number"
                        name="targetAmount"
                        value={goalForm.targetAmount}
                        onChange={handleGoalChange}
                        placeholder="Target Amount"
                        className="p-2 rounded bg-gray-700 focus:bg-gray-600"
                    />
                    <input
                        type="number"
                        name="currentSavings"
                        value={goalForm.currentSavings}
                        onChange={handleGoalChange}
                        placeholder="Current Savings"
                        className="p-2 rounded bg-gray-700 focus:bg-gray-600"
                    />
                    <input
                        type="text" // Change type to text to handle deadline as a string
                        name="deadline"
                        value={goalForm.deadline}
                        onChange={handleGoalChange}
                        placeholder="Deadline (e.g., 2024-12-31)"
                        className="p-2 rounded bg-gray-700 focus:bg-gray-600"
                    />
                    <textarea
                        name="description"
                        value={goalForm.description}
                        onChange={handleGoalChange}
                        placeholder="Goal Description"
                        className="col-span-2 p-2 rounded bg-gray-700 focus:bg-gray-600"
                    />
                </div>
                <button
                    onClick={handleSaveGoal}
                    className="mt-4 px-4 py-2 bg-blue-600 rounded hover:bg-blue-500"
                >
                    Add Goal
                </button>
            </div>

            {/* Savings Summary with Chart */}
            <div className="bg-gray-800 p-6 rounded-lg mb-8 shadow-lg">
                <h2 className="text-2xl font-semibold mb-4">Savings Summary</h2>
                <Bar
                    data={chartData}
                    options={{
                        responsive: true,
                        plugins: {
                            legend: {
                                position: 'top',
                            },
                            title: {
                                display: true,
                                text: 'Savings Goals Overview',
                            },
                        },
                        scales: {
                            y: {
                                beginAtZero: true,
                            },
                        },
                    }}
                />
            </div>

            {/* Savings Overview */}
            <div className="bg-gray-800 p-6 rounded-lg mb-8 shadow-lg">
                <h2 className="text-2xl font-semibold mb-4">Savings Overview</h2>
                {goals.map((goal) => (
                    <div key={goal.id} className="mb-6">
                        <div className="flex justify-between">
                            <div>
                                <h3 className="text-xl font-semibold">{goal.goalName}</h3>
                                <p className="text-gray-400">Target: ${goal.targetAmount}</p>
                                <p className="text-gray-400">Current Savings: ${goal.currentSavings}</p>
                                <p className="text-gray-400">Deadline: {goal.deadline}</p>
                                <p className="text-gray-400">Progress: {calculateProgress(goal)}%</p>
                            </div>
                        </div>
                        <div className="flex gap-2 mt-2">
                            <input
                                type="number"
                                value={amountsToAdd[goal.id] || ''} // Access the amount for the specific goal
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setAmountsToAdd((prev) => ({ ...prev, [goal.id]: value })); // Update state for input
                                }}
                                placeholder="Add amount"
                                className="p-2 rounded bg-gray-700 focus:bg-gray-600"
                            />
                            <button
                                onClick={() => handleAddSavings(goal.id)} // Pass the specific goal ID to handleAddSavings
                                className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-500"
                            >
                                Add Savings
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Savings;
