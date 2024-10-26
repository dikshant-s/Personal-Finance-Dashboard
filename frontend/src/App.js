import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login'; // Ensure this path is correct
import Signup from './components/Signup'; // Ensure this path is correct
import Dashboard from './components/Dashboard'; // Ensure this path is correct

function App() {
  const [user, setUser] = useState(null); // State to hold the logged-in user's name

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login setUser={setUser} />} /> {/* Pass setUser to Login */}
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard user={user} />} /> {/* Pass user to Dashboard */}
          {/* Add other routes as needed */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
