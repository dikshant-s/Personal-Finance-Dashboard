const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./modules/Users');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const Goals = require('./modules/Goals')
<<<<<<< HEAD
const Expense = require('./modules/Expenses')
=======
>>>>>>> 4bfabe7242f64d14de3d4413e45f561221f2f588
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const mongoUrl = process.env.MONGO_DB_URL;

mongoose.connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log("Connected to MongoDB"))
    .catch((error) => console.error("Error connecting to MongoDB:", error));

app.use(cors());
app.use(express.json());

const generateToken = (user) => {
    return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
        expiresIn: '7d',
    });
};

// User signup
app.post('/signup', async (req, res) => {
    const { name, username, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }
        const user = new User({ name, username, email, password });
        await user.save();
        res.status(201).json({ message: 'User created successfully', user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating user', error: error.message });
    }
});

// User login
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user || user.password !== password) {
            return res.status(400).json({ message: "Invalid email or password" });
        }
        const token = generateToken(user);
        res.status(200).json({ message: "Logged in successfully", token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

<<<<<<< HEAD
const authenticateToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Get token from Authorization header
    if (!token) return res.sendStatus(401); // Unauthorized if no token
  
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) return res.sendStatus(403); // Forbidden if token is invalid
      req.user = user; // Save user data to request object
      next(); // Call the next middleware/route handler
    });
  };
=======
// Middleware to authenticate JWT token
// const authenticateToken = (req, res, next) => {
//     const token = req.headers['authorization']?.split(' ')[1];
//     if (!token) return res.sendStatus(401);
//     jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
//         if (err) return res.sendStatus(403);
//         req.user = user;
//         next();
//     });
// };
>>>>>>> 4bfabe7242f64d14de3d4413e45f561221f2f588

// *** Add Savings Goal ***

app.post('/saving-goals', async (req, res) => {
    try {
        const { goalName, targetAmount, currentSavings, deadline, description } = req.body;

        // Check for missing fields
        // if (!goalName || !targetAmount || !currentSavings || !deadline || !description) {
        //     return res.status(400).json({ message: 'All fields are required' });
        // }

        // Ensure deadline is in correct format (if you expect a specific format)

        const newGoal = new Goals({
            goalName,
            targetAmount,
            currentSavings,
            deadline,
            description,
        });

        await newGoal.save();
        res.status(201).json({ message: 'Goal Saved', goal: newGoal });
    } catch (error) {
        console.error('Error adding new goal:', error); // Log the error on the server
        res.status(500).json({ message: 'Error adding new goal', error: error.message }); // Send the error message back to the client
    }
});


// *** Fetch Savings Goals ***
app.get('/saved-goals', async (req, res) => {
    try {
        const goals = await Goals.find();
        res.status(200).json(goals);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching saved Goals', error });
    }
});

app.put('/saving-goals/id', async (req, res) => {
    const { currentSavings } = req.body;
    const goalId = req.params.id;

    try {
        const updatedGoal = await Goals.findByIdAndUpdate(goalId, { currentSavings }, { new: true });
        res.status(200).json(updatedGoal);
    } catch (error) {
        res.status(500).json({ message: 'Error updating goal: ' + error.message });
    }
});



<<<<<<< HEAD

app.get('/expenses', authenticateToken, async (req, res) => {
    try {
      const userId = req.user.id; // Get user ID from token
      const expenses = await Expense.find({ userId }); // Fetch expenses for the user
      res.json(expenses);
    } catch (error) {
      res.status(500).json({ message: "Error fetching expenses" });
    }
  });
  
  // Create a new expense
  app.post("/expenses", async (req, res) => {
    const { amount, category, paymentMethod, date, description } = req.body;
    const newExpense = new Expense({ amount, category, paymentMethod, date, description });
  
    try {
      const savedExpense = await newExpense.save();
      res.status(201).json(savedExpense);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  
  // Update an expense
  app.put("/expenses/:id", async (req, res) => {
    const { amount, category, paymentMethod, date, description } = req.body;
  
    try {
      const updatedExpense = await Expense.findByIdAndUpdate(
        req.params.id,
        { amount, category, paymentMethod, date, description },
        { new: true } // Return the updated document
      );
  
      if (!updatedExpense) {
        return res.status(404).json({ message: "Expense not found" });
      }
  
      res.json(updatedExpense);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  
  // Delete an expense
  app.delete("/expenses/:id", async (req, res) => {
    try {
      const removedExpense = await Expense.findByIdAndDelete(req.params.id);
      res.json(removedExpense);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
 
=======
// POST endpoint to create a new contribution
app.post('/contributions', async (req, res) => {
    const { amount, date, goalId } = req.body;

    try {
        const newContribution = new Contribution({
            amount,
            date,
            goalId,
        });

        await newContribution.save();
        res.status(201).json(newContribution);
    } catch (error) {
        res.status(500).json({ message: 'Error creating contribution: ' + error.message });
    }
});

>>>>>>> 4bfabe7242f64d14de3d4413e45f561221f2f588


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
<<<<<<< HEAD
``
=======
``
>>>>>>> 4bfabe7242f64d14de3d4413e45f561221f2f588
