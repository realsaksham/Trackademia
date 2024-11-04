import React from 'react';
import { useNavigate } from 'react-router-dom';

const Header = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await onLogout(); // Call the passed logout function
      navigate('/login'); // Redirect to login page after logout
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header className="flex items-center justify-between p-4 bg-white shadow-md">
      <div className="flex items-center space-x-3">
        <img src="/path-to-your-logo.png" alt="Trackademia Logo" className="w-10 h-10" />
        <h1 className="text-xl font-bold text-indigo-600">Trackademia</h1>
      </div>
      <nav className="space-x-4">
        <a href="#" className="text-gray-600 hover:text-indigo-600">Home</a>
        <a href="#" className="text-gray-600 hover:text-indigo-600">About</a>
        <a href="#" className="text-gray-600 hover:text-indigo-600">Contact</a>
        {user ? (
          <>
            <span className="text-gray-600">Welcome, {user.email}</span>
            <button onClick={handleLogout} className="text-red-500 hover:text-red-700">
              Logout
            </button>
          </>
        ) : (
          <a href="/login" className="text-gray-600 hover:text-indigo-600">Login</a>
        )}
      </nav>
    </header>
  );
};

export default Header;
