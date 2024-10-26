// src/pages/Login.js

import React from 'react';
import { Link } from 'react-router-dom';
const Login = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-md shadow-md">
        <h2 className="text-3xl font-semibold text-center">Welcome Back</h2>
        <p className="text-center text-gray-400">Login to your account</p>
        
        <form className="mt-8 space-y-6">
          <div>
            <label className="block mb-2 text-sm">Email</label>
            <input 
              type="email" 
              required 
              className="w-full px-3 py-2 text-gray-900 rounded bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500" 
            />
          </div>
          <div>
            <label className="block mb-2 text-sm">Password</label>
            <input 
              type="password" 
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
