import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import Link for routing

const Sidebar = ({ activeSection, setActiveSection, sidebarVisible, setSidebarVisible }) => {
  const sidebarRef = useRef(null);

  // Close sidebar when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setSidebarVisible(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setSidebarVisible]);

  return (
    sidebarVisible && (
      <aside
        ref={sidebarRef}
        className="w-64 flex flex-col absolute top-0 left-0 h-full z-20 p-4 transform transition-transform duration-300 ease-in-out"
        style={{
          backgroundColor: '#1a1a1a', // Dark gray for a softer black theme
          transform: sidebarVisible ? 'translateX(0)' : 'translateX(-100%)',
        }}
      >
        <nav className="flex-grow">
          <ul>
            {['Home', 'Stats', 'Leaderboard', 'Assignments', 'Courses', 'Attendance'].map((section) => (
              <li
                key={section}
                onClick={() => { setActiveSection(section); setSidebarVisible(false); }}
                className={`p-4 cursor-pointer transition-transform duration-200 ease-in-out transform hover:scale-105 hover:shadow-lg ${
                  activeSection === section ? 'bg-purple-500 text-white rounded-xl' : 'text-gray-300'
                }`}
                style={{ color: activeSection === section ? 'white' : 'inherit' }}
              >
                {section}
              </li>
            ))}
          </ul>
        </nav>
        {/* Add Pomodoro Link */}
        <Link
          to="/pomodoro"
          className="p-4 cursor-pointer transition-transform duration-200 ease-in-out transform hover:scale-105 hover:shadow-lg mt-4 text-gray-300 hover:bg-purple-500 hover:text-white rounded-xl"
          onClick={() => setSidebarVisible(false)} // Close sidebar when clicking
        >
          Pomodoro
        </Link>
        <footer className="text-center mt-4 text-gray-400">© 2024 Trackademia</footer>
      </aside>
    )
  );
};

export default Sidebar;
