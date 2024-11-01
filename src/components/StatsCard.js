import React from 'react';

const StatsCard = ({ title, value }) => (
  <div className="p-4 bg-white shadow rounded-lg text-center">
    <h3 className="text-sm font-semibold text-gray-500">{title}</h3>
    <p className="mt-1 text-2xl font-bold text-indigo-600">{value}</p>
  </div>
);

export default StatsCard;
