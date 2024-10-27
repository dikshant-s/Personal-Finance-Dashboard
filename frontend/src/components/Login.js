// src/pages/Login.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [isLoggged,setIsLogged] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault(); 

    try {
      const response = await fetch('http://localhost:8000/login', {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Login successful:', data);
        setIsLogged(true)
        navigate('/dashboard');
        localStorage.setItem("token", data.token); // Save the token with a key
        localStorage.setItem("name", data.name);   // Save the name with a key      
        
      } else {
        setError(data.message || 'Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      setError('Something went wrong. Please try again later.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-md shadow-md">
        {isLoggged && <h2 className="text-3xl font-semibold text-center">Welcome Back! </h2> }
        <p className="text-center text-gray-400">Login to your account</p>
        
        {error && <p className="text-red-500 text-center">{error}</p>}

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div>
            <label className="block mb-2 text-sm">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)} 
              required 
              className="w-full px-3 py-2 text-gray-900 rounded bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500" 
            />
          </div>
          <div>
            <label className="block mb-2 text-sm">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)} 
              required 
              className="w-full px-3 py-2 text-gray-900 rounded bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500" 
            />
          </div>
          <button 
            type="submit" 
            className="w-full py-2 font-semibold text-center text-white bg-indigo-600 rounded-md hover:bg-indigo-500"
          >
            Login
          </button>
        </form>
        
        <div className="text-center text-gray-400">
          Don't have an account? <Link to="/signup" className="text-indigo-500">Sign Up</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;