import React from 'react';
import { Link } from 'react-router-dom';

const Signup = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-md shadow-md">
        <h2 className="text-3xl font-semibold text-center">Create an Account</h2>
        <p className="text-center text-gray-400">Join us to manage your finances</p>
        
        <form className="mt-8 space-y-6">
          <div>
            <label className="block mb-2 text-sm">Full Name</label>
            <input 
              type="text" 
              required 
              className="w-full px-3 py-2 text-gray-900 rounded bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500" 
            />
          </div>
          <div>
            <label className="block mb-2 text-sm">Username</label>
            <input 
              type="text" 
              required 
              className="w-full px-3 py-2 text-gray-900 rounded bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500" 
            />
          </div>
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
            Sign Up
          </button>
        </form>
        
        <div className="text-center text-gray-400">
          Already have an account? <Link to="/login" className="text-indigo-500">Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
