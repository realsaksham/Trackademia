import React from 'react';

const Leaderboard = () => (
  <div className="p-4 bg-white shadow rounded-lg">
    <h2 className="text-lg font-bold text-gray-700">Leaderboard</h2>
    <ul className="mt-4 space-y-3">
      <li className="flex justify-between text-gray-700">
        <span>1. John Doe</span>
        <span>1500 points</span>
      </li>
      <li className="flex justify-between text-gray-700">
        <span>2. Jane Smith</span>
        <span>1450 points</span>
      </li>
      <li className="flex justify-between text-gray-700">
        <span>3. Mark Johnson</span>
        <span>1400 points</span>
      </li>
    </ul>
  </div>
);

export default Leaderboard;
