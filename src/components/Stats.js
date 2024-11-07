// Stats.js
import React from 'react';
import StatsCard from './StatsCard';

const Stats = ({ auraPoints, attendance, completedAssignments }) => {
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatsCard title="Aura Points" value={auraPoints} />
      <StatsCard title="Attendance" value={attendance} />
      <StatsCard title="Completed Assignments" value={completedAssignments} />
      {/* <StatsCard title="Current Ranking" value="#5" /> */}
    </section>
  );
};

export default Stats;
