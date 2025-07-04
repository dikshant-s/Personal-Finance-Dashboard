import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";

function App() {
  const [user, setUser] = useState(null); // Holds logged-in user name
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Auth state

  useEffect(() => {
    // On mount, check if token and user exist in localStorage
    const token = localStorage.getItem("token");
    const name = localStorage.getItem("name");

    if (token && name) {
      setUser(name);
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <Navigate to="/dashboard" />
              ) : (
                <Login
                  setUser={setUser}
                  setIsAuthenticated={setIsAuthenticated}
                />
              )
            }
          />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/dashboard"
            element={
              isAuthenticated ? (
                <Dashboard
                  user={user}
                  setUser={setUser}
                  setIsAuthenticated={setIsAuthenticated}
                />
              ) : (
                <Navigate to="/" />
              )
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
