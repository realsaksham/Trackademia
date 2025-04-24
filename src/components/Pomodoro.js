import React, { useState, useEffect, useRef } from 'react';
import pomodoroGif from '../assets/giphy.gif';

const Pomodoro = () => {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [workMinutes, setWorkMinutes] = useState(25);
  const [breakMinutes, setBreakMinutes] = useState(5);
  const [sessionType, setSessionType] = useState('Work');
  const canvasRef = useRef(null);

  const totalTimeInSeconds = (sessionType === 'Work' ? workMinutes : breakMinutes) * 60;
  const remainingTimeInSeconds = minutes * 60 + seconds;
  const progress = remainingTimeInSeconds / totalTimeInSeconds;

  const drawProgress = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const radius = canvas.width / 2;
    const lineWidth = 12;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.arc(radius, radius, radius - lineWidth, 0, Math.PI * 2);
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = '#111';
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(
      radius,
      radius,
      radius - lineWidth,
      -Math.PI / 2,
      -Math.PI / 2 + Math.PI * 2 * progress
    );
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = '#9B59B6';
    ctx.stroke();
  };

  useEffect(() => { drawProgress(); }, [remainingTimeInSeconds, sessionType]);

  useEffect(() => {
    let timer;
    if (isActive) {
      timer = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            clearInterval(timer);
            const nextType = sessionType === 'Work' ? 'Break' : 'Work';
            setSessionType(nextType);
            setMinutes(nextType === 'Work' ? workMinutes : breakMinutes);
            setSeconds(0);
            setIsActive(false);
          } else { setMinutes(m => m - 1); setSeconds(59); }
        } else { setSeconds(s => s - 1); }
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isActive, seconds, minutes, sessionType, workMinutes, breakMinutes]);

  const toggleTimer = () => {
    if (!isActive && minutes === 0 && seconds === 0) {
      setMinutes(sessionType === 'Work' ? workMinutes : breakMinutes);
      setSeconds(0);
    }
    setIsActive(a => !a);
  };

  const handleReset = () => { setIsActive(false); setSessionType('Work'); setMinutes(workMinutes); setSeconds(0); };
  const adjustMinutes = (type, delta) => {
    if (type === 'Work') {
      setWorkMinutes(m => Math.max(1, m + delta));
      if (sessionType === 'Work' && !isActive) setMinutes(m => Math.max(1, m + delta));
    } else {
      setBreakMinutes(m => Math.max(1, m + delta));
      if (sessionType === 'Break' && !isActive) setMinutes(m => Math.max(1, m + delta));
    }
  };

  return (
    <div className="h-screen flex">
      <div className="w-1/2 h-full bg-black flex flex-col justify-center items-center p-8 space-y-8">
        <h2 className="text-4xl font-bold text-white animate-fadeInDown">{sessionType} Session</h2>

        <div className="relative">
          <canvas ref={canvasRef} width={240} height={240} />
          <div className="absolute inset-0 flex items-center justify-center animate-scaleIn">
            <span className="text-5xl text-white font-mono">
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </span>
          </div>
        </div>

        <div className="flex space-x-12">
          {['Work', 'Break'].map(type => (
            <div key={type} className="flex flex-col items-center hover:scale-105 transition-transform">
              <span className="text-white mb-2">{type} Minutes</span>
              <div className="flex items-center space-x-4">
                <button onClick={() => adjustMinutes(type, -1)}
                  className="text-white text-2xl hover:opacity-70 transition-opacity">−</button>
                <span className="text-white text-2xl font-semibold">
                  {type === 'Work' ? workMinutes : breakMinutes}
                </span>
                <button onClick={() => adjustMinutes(type, 1)}
                  className="text-white text-2xl hover:opacity-70 transition-opacity">+</button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex space-x-8">
          <button onClick={toggleTimer}
            className="px-8 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-500 transition-transform transform hover:scale-105">
            {isActive ? 'Pause' : 'Start'}
          </button>
          <button onClick={handleReset}
            className="px-8 py-3 bg-gray-700 text-white rounded-xl hover:bg-gray-600 transition-transform transform hover:scale-105">
            Reset
          </button>
        </div>
      </div>

      <div className="w-1/2 h-full relative">
        <img src={pomodoroGif} alt="Pomodoro GIF"
          className="w-full h-full object-cover animate-pulseSlow" />
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-black to-transparent" />
      </div>
    </div>
  );
};

export default Pomodoro;
