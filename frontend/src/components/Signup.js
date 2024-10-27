import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Signup = () => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8000/signup', {
        method: 'POST',  // Specify the HTTP method
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, username, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Signup successful:', data);
        navigate('/'); // Redirect to login page after successful signup
      } else {
        setError(data.message || 'Signup failed. Please try again.');
      }
    } catch (error) {
      console.error('Error signing up:', error);
      setError('Something went wrong. Please try again later.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-md shadow-md">
        <h2 className="text-3xl font-semibold text-center">Create an Account</h2>
        <p className="text-center text-gray-400">Join us to manage your finances</p>

        {error && <p className="text-red-500 text-center">{error}</p>} {/* Display error messages */}

        <form className="mt-8 space-y-6" onSubmit={handleSignup}>
          <div>
            <label className="block mb-2 text-sm">Full Name</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)} 
              required 
              className="w-full px-3 py-2 text-gray-900 rounded bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500" 
            />
          </div>
          <div>
            <label className="block mb-2 text-sm">Username</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)} 
              required 
              className="w-full px-3 py-2 text-gray-900 rounded bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500" 
            />
          </div>
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