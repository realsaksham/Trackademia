import React, { useRef, useEffect } from 'react';

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
        className="w-64 bg-[#000000] text-white flex flex-col absolute top-0 left-0 h-full z-20 p-4"
      >
        <nav className="flex-grow">
          <ul>
            <li onClick={() => { setActiveSection('Home'); setSidebarVisible(false); }}
                className={`p-4 cursor-pointer ${activeSection === 'Home' ? 'text-white bg-zinc-900 rounded-xl' : 'text-gray-600'}`}
            >
              Home
            </li>
            <li onClick={() => { setActiveSection('Stats'); setSidebarVisible(false); }}
                className={`p-4 cursor-pointer ${activeSection === 'Stats' ? 'text-white bg-zinc-900 rounded-xl' : 'text-gray-600'}`}
            >
              Stats
            </li>
            <li onClick={() => { setActiveSection('Leaderboard'); setSidebarVisible(false); }}
                className={`p-4 cursor-pointer ${activeSection === 'Leaderboard' ? 'text-white bg-zinc-900 rounded-xl' : 'text-gray-600'}`}
            >
              Leaderboard
            </li>
            <li onClick={() => { setActiveSection('Assignments'); setSidebarVisible(false); }}
                className={`p-4 cursor-pointer ${activeSection === 'Assignments' ? 'text-white bg-zinc-900 rounded-xl' : 'text-gray-600'}`}
            >
              Assignments
            </li>
            <li onClick={() => { setActiveSection('Timetable'); setSidebarVisible(false); }}
                className={`p-4 cursor-pointer ${activeSection === 'Timetable' ? 'text-white bg-zinc-900 rounded-xl' : 'text-gray-600'}`}
            >
              Timetable
            </li>
            <li onClick={() => { setActiveSection('Courses'); setSidebarVisible(false); }}
                className={`p-4 cursor-pointer ${activeSection === 'Courses' ? 'text-white bg-zinc-900 rounded-xl' : 'text-gray-600'}`}
            >
              Courses
            </li>
            <li onClick={() => { setActiveSection('Attendence'); setSidebarVisible(false); }}
                className={`p-4 cursor-pointer ${activeSection === 'Attendence' ? 'text-white bg-zinc-900 rounded-xl' : 'text-gray-600'}`}
            >
              Attendence
            </li>
          </ul>
        </nav>
        <footer className="text-center text-gray-400 mt-4">© 2024 Trackademia</footer>
      </aside>
    )
  );
};

export default Sidebar;
