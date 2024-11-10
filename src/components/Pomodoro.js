import React, { useState, useEffect } from 'react';

const Pomodoro = () => {
  const [minutes, setMinutes] = useState(25); // Default Pomodoro session length
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false); // Timer state
  const [inputMinutes, setInputMinutes] = useState(25); // For input field to set time
  const [inputSeconds, setInputSeconds] = useState(0); // For input field to set time

  const totalTimeInSeconds = inputMinutes * 60 + inputSeconds;
  const remainingTimeInSeconds = minutes * 60 + seconds;
  const progress = (remainingTimeInSeconds / totalTimeInSeconds) * 100;

  useEffect(() => {
    let timer;

    if (isActive) {
      timer = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            clearInterval(timer); // Timer ends when it reaches 0
            alert('Pomodoro session complete!'); // Alert when timer ends
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        } else {
          setSeconds(seconds - 1);
        }
      }, 1000);
    } else {
      clearInterval(timer); // Clear timer when paused or stopped
    }

    return () => clearInterval(timer); // Cleanup on unmount
  }, [isActive, seconds, minutes]);

  const handleStart = () => {
    setMinutes(inputMinutes);
    setSeconds(inputSeconds);
    setIsActive(true);
  };

  const handleReset = () => {
    setMinutes(inputMinutes);
    setSeconds(inputSeconds);
    setIsActive(false);
  };

  return (
    <div className="pomodoro-container w-full max-w-xl mx-auto p-6 bg-gray-900 rounded-xl shadow-lg flex flex-col justify-center items-center gap-6">
      <h2 className="text-3xl text-center font-bold text-purple-300">Pomodoro Timer</h2>

      {/* Circular Progress */}
      <div className="relative w-32 h-32">
        <svg className="absolute transform -rotate-90" width="100%" height="100%" viewBox="0 0 36 36">
          <circle
            className="text-gray-700"
            cx="18"
            cy="18"
            r="15.9"
            strokeWidth="3"
            fill="none"
          />
          <circle
            className="text-[#F8B234]"  // Updated circle color
            cx="18"
            cy="18"
            r="15.9"
            strokeWidth="3"
            fill="none"
            strokeDasharray="100"
            strokeDashoffset={100 - progress} // Adjust the offset dynamically
            style={{ transition: 'stroke-dashoffset 1s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex justify-center items-center">
          <span className="text-2xl font-bold text-white">
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </span>
        </div>
      </div>

      {/* Time Input */}
      <div className="flex justify-center gap-4 mt-6">
        <div className="flex flex-col items-center">
          <label className="text-white text-lg">Set Minutes</label>
          <input
            type="number"
            min="1"
            value={inputMinutes}
            onChange={(e) => setInputMinutes(Number(e.target.value))}
            className="px-4 py-2 bg-gray-800 text-white rounded-lg text-center w-20"
          />
        </div>
        <div className="flex flex-col items-center">
          <label className="text-white text-lg">Set Seconds</label>
          <input
            type="number"
            min="0"
            max="59"
            value={inputSeconds}
            onChange={(e) => setInputSeconds(Number(e.target.value))}
            className="px-4 py-2 bg-gray-800 text-white rounded-lg text-center w-20"
          />
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex justify-center gap-6 mt-4">
        {/* Start/Pause Button */}
        <button
          onClick={handleStart}
          className="px-6 py-3 bg-purple-500 text-white font-semibold rounded-lg transition-transform transform hover:scale-105 hover:bg-purple-400 focus:outline-none"
        >
          {isActive ? 'Pause' : 'Start'}
        </button>

        {/* Reset Button */}
        <button
          onClick={handleReset}
          className="px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg transition-transform transform hover:scale-105 hover:bg-gray-500 focus:outline-none"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default Pomodoro;
