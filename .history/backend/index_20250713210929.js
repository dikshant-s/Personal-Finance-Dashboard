const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./modules/Users");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const Goals = require("./modules/Goals");
const Expense = require("./modules/Expenses");
const Investment = require("./modules/Investments");
const Savings = require("./modules/Savings");
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const mongoUrl = process.env.MONGO_DB_URL;

mongoose
  .connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("Error connecting to MongoDB:", error));

app.use(cors());
app.use(express.json());

const generateToken = (user) => {
  return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: "3h", // Token expires in 30 seconds
  });
};

// User signup
app.post("/signup", async (req, res) => {
  const { name, username, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }
    const user = new User({ name, username, email, password });
    await user.save();
    res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error creating user", error: error.message });
  }
});

// User login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const token = generateToken(user);
    res.status(200).json({
      message: "Logged in successfully",
      token,
      name: user.name,
      balance: user.balance,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

const authenticateToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) return res.status(401).json({ message: "No token provided" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      // Token has expired or is invalid
      return res.status(401).json({ message: "Token expired or invalid" });
    }

    req.user = user;
    next();
  });
};

app.post("/saving-goals", authenticateToken, async (req, res) => {
  const { goalName, targetAmount, currentSavings, deadline, description } =
    req.body;

  // Get user ID from token
  const userId = req.user.id;

  try {
    const newGoal = new Goals({
      goalName,
      targetAmount,
      currentSavings,
      deadline,
      description,
      userId, // Include userId in the goal document
    });

    await newGoal.save();
    res.status(201).json({ message: "Goal Saved", goal: newGoal });
  } catch (error) {
    console.error("Error adding new goal:", error);
    res
      .status(500)
      .json({ message: "Error adding new goal", error: error.message });
  }
});

// GET: Fetch savings goals for a specific user
app.get("/saved-goals", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id; // Get user ID from the token
    const goals = await Goals.find({ userId }); // Fetch goals for the specific user
    res.status(200).json(goals);
  } catch (error) {
    res.status(500).json({ message: "Error fetching saved goals", error });
  }
});

app.put("/saving-goals/:id", async (req, res) => {
  const { amountToAdd } = req.body; // Get the amount to add from the request body
  console.log("Updating goal ID:", req.params.id, "with amount:", amountToAdd); // Log the incoming request

  try {
    // Find the goal by ID and update the current savings
    const goal = await Goals.findById(req.params.id);
    if (!goal) {
      console.log("Goal not found:", req.params.id);
      return res.status(404).json({ message: "Goal not found" });
    }

    // Update the current savings
    goal.currentSavings += amountToAdd; // Increment current savings
    await goal.save(); // Save the updated goal

    res.status(200).json(goal); // Return the updated goal
  } catch (error) {
    console.error("Error updating goal:", error);
    res
      .status(500)
      .json({ message: "Error updating goal", error: error.message });
  }
});

app.delete("/saving-goals/:id", async (req, res) => {
  try {
    const goalId = req.params.id;
    const deletedGoal = await Goals.findByIdAndDelete(goalId);

    if (!deletedGoal) {
      return res.status(404).json({ message: "Goal not found" });
    }
    res.status(200).json({ message: "Goal deleted successfully" });
  } catch (error) {
    console.error("Error deleting goal:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Investment end points

app.get("/investments", authenticateToken, async (req, res) => {
  try {
    // Fetch investments for the user ID from the token
    const userId = req.user.id; // Assuming `req.user.id` contains the logged-in user's ID
    const investments = await Investment.find({ userId: userId });

    res.json({ investments });
  } catch (error) {
    console.error("Error fetching investments:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/investments", authenticateToken, async (req, res) => {
  const { assetName, type, quantity, purchasePrice, currentPrice } = req.body;
  const investment = new Investment({
    userId: req.user.id, // Ensure this is set correctly
    assetName,
    type,
    quantity,
    purchasePrice,
    currentPrice,
  });

  try {
    const newInvestment = await investment.save();
    res.status(201).json(newInvestment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.delete("/investments/:id", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id; // Get the logged-in user's ID
    const investmentId = req.params.id; // Get the investment ID from the URL

    // Find the investment by ID and ensure it belongs to the user
    const investment = await Investment.findOneAndDelete({
      _id: investmentId,
      userId: userId,
    });

    if (!investment) {
      return res
        .status(404)
        .json({ message: "Investment not found or doesn't belong to user" });
    }

    res.json({ message: "Investment deleted successfully" });
  } catch (error) {
    console.error("Error deleting investment:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/expenses", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id; // Get user ID from token
    console.log("Fetching expenses for user ID:", userId); // Log user ID
    const expenses = await Expense.find({ userId }); // Fetch expenses for the user
    console.log("Fetched expenses:", expenses); // Log fetched expenses
    res.json(expenses);
  } catch (error) {
    console.error("Error fetching expenses:", error); // Log the error
    res.status(500).json({ message: "Error fetching expenses" });
  }
});

// Create a new expense
app.post("/expenses", authenticateToken, async (req, res) => {
  const { amount, category, paymentMethod, date, description } = req.body;

  if (!amount || !category || !paymentMethod || !date) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const expense = new Expense({
      userId: req.user.id,
      amount,
      category,
      paymentMethod,
      date,
      description,
    });

    await expense.save();

    // Subtract from user balance
    await User.findByIdAndUpdate(req.user.id, {
      $inc: { balance: -parseFloat(amount) },
    });

    res.status(201).json(expense);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating expense" });
  }
});

// Update an expense
app.put("/expenses/:id", authenticateToken, async (req, res) => {
  const { amount, category, paymentMethod, date, description } = req.body;

  try {
    const oldExpense = await Expense.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });
    if (!oldExpense)
      return res.status(404).json({ message: "Expense not found" });

    const oldAmount = parseFloat(oldExpense.amount);
    const newAmount = parseFloat(amount);
    const diff = oldAmount - newAmount; // +ve = refund to user, -ve = deduct more

    const updatedExpense = await Expense.findByIdAndUpdate(
      req.params.id,
      { amount, category, paymentMethod, date, description },
      { new: true }
    );

    // Update balance with the difference
    await User.findByIdAndUpdate(req.user.id, {
      $inc: { balance: diff },
    });

    res.json(updatedExpense);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete an expense
app.delete("/expenses/:id", authenticateToken, async (req, res) => {
  try {
    const expense = await Expense.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    // Add the amount back to balance
    await User.findByIdAndUpdate(req.user.id, {
      $inc: { balance: parseFloat(expense.amount) },
    });

    await Expense.deleteOne({ _id: req.params.id });
    res.json({ message: "Expense deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get recent expenses for Activity section
app.get("/expenses/activity/recent", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const limit = parseInt(req.query.limit) || 5;

    const expenses = await Expense.find({ userId })
      .sort({ date: -1 })
      .limit(limit);

    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: "Error fetching recent expenses" });
  }
});

// GET: Paginated expenses for a user
app.get("/expenses/paginated", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;

    const skip = (page - 1) * limit;

    const expenses = await Expense.find({ userId })
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Expense.countDocuments({ userId });

    res.json({
      data: expenses,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching paginated expenses" });
  }
});

// GET user's balance
app.get("/balance", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ balance: user.balance || 0 });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// UPDATE user's balance
app.put("/balance", authenticateToken, async (req, res) => {
  let { balance } = req.body;

  try {
    // Ensure balance is a valid number
    balance = parseFloat(balance);
    if (isNaN(balance)) {
      return res.status(400).json({ message: "Invalid balance value" });
    }

    // Update the user's balance
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { balance },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "Balance updated", balance: user.balance });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to update balance", error: err.message });
  }
});

app.get("/total-income", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch total savings
    const totalSavingsGoals = await Goals.aggregate([
      // Ensure this matches the model name
      { $match: { userId: userId } },
      { $group: { _id: null, total: { $sum: "$currentSavings" } } },
    ]);
    const totalSavings =
      totalSavingsGoals.length > 0 ? totalSavingsGoals[0].total : 0;

    // Fetch total investments
    const totalInvestments = await Investment.aggregate([
      { $match: { userId: userId } },
      {
        $group: {
          _id: null,
          total: { $sum: { $multiply: ["$quantity", "$currentPrice"] } },
        },
      },
    ]);
    const totalInvestmentValue =
      totalInvestments.length > 0 ? totalInvestments[0].total : 0;

    // Combine totals
    const totalIncome = totalSavings + totalInvestmentValue;
    console.log(totalIncome);
    res.json({ totalIncome });
  } catch (error) {
    console.error("Error fetching total income:", error);
    res.status(500).json({ message: "Server error" });
  }
});



// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

