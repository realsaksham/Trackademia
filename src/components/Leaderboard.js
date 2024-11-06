import React from 'react';

const Leaderboard = () => (
  <div className="p-4 bg-[#1A1A1D] shadow rounded-lg">
    <ul className="mt-4 space-y-3">
      <li className="flex justify-between text-white">
        <span>1. John Doe</span>
        <span className='text-[#EBD3F8]' >1500 points</span>
      </li>
      <li className="flex justify-between text-white">
        <span>2. Jane Smith</span>
        <span className='text-[#EBD3F8]' >1450 points</span>
      </li>
      <li className="flex justify-between text-white">
        <span>3. Mark Johnson</span>
        <span className='text-[#EBD3F8]'>1400 points</span>
      </li>
    </ul>
  </div>
);

export default Leaderboard;
