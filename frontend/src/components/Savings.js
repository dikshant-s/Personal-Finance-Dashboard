import React, { useState } from 'react';
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
  const [goalForm, setGoalForm] = useState({
    id: null,
    name: '',
    targetAmount: '',
    currentSavings: '',
    deadline: '',
    description: ''
  });
  const [contribution, setContribution] = useState({
    amount: '',
    date: '',
    goalId: '',
    recurring: false,
    interval: 'monthly'
  });

  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const handleGoalChange = (e) => {
    setGoalForm({ ...goalForm, [e.target.name]: e.target.value });
  };

  const handleContributionChange = (e) => {
    setContribution({ ...contribution, [e.target.name]: e.target.value });
  };

  const addGoal = () => {
    if (isEditing) {
      setGoals(goals.map(goal => (goal.id === goalForm.id ? goalForm : goal)));
      setIsEditing(false);
    } else {
      setGoals([...goals, { ...goalForm, id: goals.length + 1, progress: 0 }]);
    }
    resetGoalForm();
  };

  const resetGoalForm = () => {
    setGoalForm({
      id: null,
      name: '',
      targetAmount: '',
      currentSavings: '',
      deadline: '',
      description: ''
    });
  };

  const editGoal = (goal) => {
    setGoalForm(goal);
    setIsEditing(true);
  };

  const deleteGoal = (id) => {
    setGoals(goals.filter(goal => goal.id !== id));
  };

  const addContribution = () => {
    const goal = goals.find(g => g.id === Number(contribution.goalId));

    if (goal) {
      const contributionDate = new Date(contribution.date);
      const deadlineDate = new Date(goal.deadline);

      if (contributionDate > deadlineDate) {
        setError('Deadline is reached. No further contributions are possible. Try to add savings to other goals.');
        return;
      }

      goal.currentSavings = Number(goal.currentSavings) + Number(contribution.amount);
      setError('');
      setContribution({ amount: '', date: '', goalId: '', recurring: false, interval: 'monthly' });
    }
  };

  const calculateProgress = (goal) => {
    const target = Number(goal.targetAmount);
    const current = Number(goal.currentSavings);
    return target > 0 ? Math.min((current / target) * 100, 100) : 0;
  };

  const chartData = {
    labels: goals.map(goal => goal.name),
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

  const totalCurrentSavings = goals.reduce((acc, goal) => acc + Number(goal.currentSavings), 0);
  const totalTargetAmount = goals.reduce((acc, goal) => acc + Number(goal.targetAmount), 0);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-semibold mb-6">Savings Goals</h1>

      {/* Set Savings Goal Section */}
      <div className="bg-gray-800 p-6 rounded-lg mb-8 shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">{isEditing ? 'Edit Savings Goal' : 'Set Savings Goal'}</h2>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="name"
            value={goalForm.name}
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
            type="date"
            name="deadline"
            value={goalForm.deadline}
            onChange={handleGoalChange}
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
          onClick={addGoal}
          className="mt-4 px-4 py-2 bg-blue-600 rounded hover:bg-blue-500"
        >
          {isEditing ? 'Update Goal' : 'Add Goal'}
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
                <h3 className="text-xl font-semibold">{goal.name}</h3>
                <p className="text-gray-400">Target: ${goal.targetAmount}</p>
                <p className="text-gray-400">Current Savings: ${goal.currentSavings}</p>
                <p className="text-gray-400">Deadline: {goal.deadline}</p>
                <p className="text-gray-400">Progress: {calculateProgress(goal)}%</p>
              </div>
              <div>
                <button onClick={() => editGoal(goal)} className="px-4 py-2 bg-yellow-600 rounded hover:bg-yellow-500 mr-2">Edit</button>
                <button onClick={() => deleteGoal(goal.id)} className="px-4 py-2 bg-red-600 rounded hover:bg-red-500">Delete</button>
              </div>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-4 mt-2">
              <div
                className="bg-blue-500 h-4 rounded-full"
                style={{ width: `${calculateProgress(goal)}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {/* Flex container for Contribution section */}
      <div className="bg-gray-800 p-6 rounded-lg w-full mb-8">
        <h2 className="text-2xl font-semibold mb-4">Add Contribution</h2>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="number"
            name="amount"
            value={contribution.amount}
            onChange={handleContributionChange}
            placeholder="Amount Contributed"
            className="p-2 rounded bg-gray-700 focus:bg-gray-600"
          />
          <input
            type="date"
            name="date"
            value={contribution.date}
            onChange={handleContributionChange}
            className="p-2 rounded bg-gray-700 focus:bg-gray-600"
          />
          <select
            name="goalId"
            value={contribution.goalId}
            onChange={handleContributionChange}
            className="p-2 rounded bg-gray-700 focus:bg-gray-600"
          >
            <option value="">Select Goal</option>
            {goals.map(goal => (
              <option key={goal.id} value={goal.id}>{goal.name}</option>
            ))}
          </select>
        </div>
        <button
          onClick={addContribution}
          className="mt-4 px-4 py-2 bg-green-600 rounded hover:bg-green-500"
        >
          Add Contribution
        </button>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-600 text-white rounded">
          {error}
        </div>
      )}
    </div>
  );
};

export default Savings;
