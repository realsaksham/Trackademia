import React from 'react';

const StatsCard = ({ title, value }) => (
  <div className="p-4 bg-[#1A1A1D] shadow rounded-lg text-center">
    <h3 className="text-sm font-semibold text-[#EBD3F8]">{title}</h3>
    <p className="mt-1 text-4xl font-bold text-white">{value}</p>
  </div>
);

export default StatsCard;
