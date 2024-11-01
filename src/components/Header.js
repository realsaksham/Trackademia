import React from 'react';

const Header = () => (
  <header className="flex items-center justify-between p-4 bg-white shadow-md">
    <div className="flex items-center space-x-3">
      <img src="/path-to-your-logo.png" alt="Trackademia Logo" className="w-10 h-10" />
      <h1 className="text-xl font-bold text-indigo-600">Trackademia</h1>
    </div>
    <nav className="space-x-4">
      <a href="#" className="text-gray-600 hover:text-indigo-600">Dashboard</a>
      <a href="#" className="text-gray-600 hover:text-indigo-600">Leaderboard</a>
      <a href="#" className="text-gray-600 hover:text-indigo-600">Rewards</a>
    </nav>
  </header>
);

export default Header;
