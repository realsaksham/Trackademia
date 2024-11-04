import React from 'react';

const Timetable = ({ timetable }) => (
    <div>
      <h2>Weekly Timetable</h2>
      {timetable.map(entry => (
        <div key={entry.id}>
          <h3>{entry.courseName}</h3>
          <p>{entry.day}: {entry.time}</p>
        </div>
      ))}
    </div>
  );

  export default Timetable;

  