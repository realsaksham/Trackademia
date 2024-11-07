import React, { useEffect, useRef, useState } from 'react';
import { auth, db } from '../config/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc,getDocs,collection ,query,where} from 'firebase/firestore';
import StatsCard from './StatsCard';
import Leaderboard from './Leaderboard';
import Assignment from './Assignment.js';
import Timetable from './Timetable.js';
import Courses from './Courses.js';
import Attendence from './Attendence.js';

const Home = () => {
  const [userName, setUserName] = useState('');
  const [auraPoints, setAuraPoints] = useState(0);
  const [present,setPresent] = useState(0);
  const [assignments, setAssignments] = useState([]);
  const [activeSection, setActiveSection] = useState('Stats');
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const sidebarRef = useRef(null);  // Ref for the sidebar
  const userId = auth.currentUser ? auth.currentUser.uid : null;

  const fetchAuraPoints = async () => {
    const user = auth.currentUser;
    if (user) {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        setAuraPoints(userDoc.data().auraPoints || 0);
      }
    }
  };
  const fetchAttendence = async () => {
    const user = auth.currentUser;
    if (user) {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        setPresent(userDoc.data().attendance || 0);
      }
    }
  };
  const fetchAssignments = async () => {
    if (userId) {
      const assignmentsCollection = collection(db, 'users', userId, 'assignments');
      const completedAssignmentsQuery = query(assignmentsCollection, where('status', '==', 'Completed'));
  
      try {
        const assignmentSnapshot = await getDocs(completedAssignmentsQuery);
        const completedAssignmentList = assignmentSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAssignments(completedAssignmentList);
      } catch (error) {
        console.error("Error fetching completed assignments: ", error);
      }
    }
  };


  useEffect(() => {
    fetchAuraPoints();
    fetchAttendence();
    fetchAssignments();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setUserName(userDoc.data().displayName || 'User');
        } else {
          setUserName('User');
        }
      } else {
        setUserName('');
        setAuraPoints(0);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Close sidebar when clicking outside of it
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setSidebarVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'Stats':
        return (
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatsCard title="Aura Points" value={auraPoints} />
            <StatsCard title="Attendence" value={present} />
            <StatsCard title="Completed Assignments" value={assignments.length} />
            {/* <StatsCard title="Current Ranking" value="#5" /> */}
          </section>
        );
      case 'Leaderboard':
        return (
          <section>
            <h2 className="text-2xl font-semibold text-white text-center">Leaderboard</h2>
            <Leaderboard />
          </section>
        );
      case 'Assignments':
        return <Assignment onAuraPointsUpdated={fetchAuraPoints} />;
      case 'Timetable':
        return <Timetable />;
      case 'Courses':
        return <Courses />;
      case 'Attendence':
        return <Attendence onAuraPointsUpdated={fetchAuraPoints} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex">
      <button 
        onMouseEnter={() => setSidebarVisible(!sidebarVisible)} // Toggle visibility on hover
        className="text-black tracking-widest  bg-transparent hover:bg-[#616467] hover: transition duration-200"
      >
        {sidebarVisible ? '--' : '--'}
      </button>

      {/* Sidebar */}
      {sidebarVisible && (
        <aside
          ref={sidebarRef}  // Set the ref to the sidebar
          className="w-64 bg-[#000000] text-white flex flex-col absolute top-0 left-0 h-full z-20 p-4"
        >
          <nav className="flex-grow">
            <ul>
              <li
                onClick={() => { setActiveSection('Stats'); setSidebarVisible(false); }}
                className={`p-4 cursor-pointer ${activeSection === 'Stats' ? 'text-white bg-zinc-900 rounded-xl' : 'text-gray-600'}`}
              >
                Stats
              </li>
              <li
                onClick={() => { setActiveSection('Leaderboard'); setSidebarVisible(false); }}
                className={`p-4 cursor-pointer ${activeSection === 'Leaderboard' ? 'text-white bg-zinc-900 rounded-xl' : 'text-gray-600'}`}
              >
                Leaderboard
              </li>
              <li
                onClick={() => { setActiveSection('Assignments'); setSidebarVisible(false); }}
                className={`p-4 cursor-pointer ${activeSection === 'Assignments' ? 'text-white bg-zinc-900 rounded-xl' : 'text-gray-600'}`}
              >
                Assignments
              </li>
              <li
                onClick={() => { setActiveSection('Timetable'); setSidebarVisible(false); }}
                className={`p-4 cursor-pointer ${activeSection === 'Timetable' ? 'text-white bg-zinc-900 rounded-xl' : 'text-gray-600'}`}
              >
                Timetable
              </li>
              <li
                onClick={() => { setActiveSection('Courses'); setSidebarVisible(false); }}
                className={`p-4 cursor-pointer ${activeSection === 'Courses' ? 'text-white bg-zinc-900 rounded-xl' : 'text-gray-600'}`}
              >
                Courses
              </li>
              <li
                onClick={() => { setActiveSection('Attendence'); setSidebarVisible(false); }}
                className={`p-4 cursor-pointer ${activeSection === 'Attendence' ? 'text-white bg-zinc-900 rounded-xl' : 'text-gray-600'}`}
              >
                Attendence
              </li>
            </ul>
          </nav>
          <footer className="text-center text-gray-400 mt-4">© 2024 Trackademia</footer>
        </aside>
      )}

      {/* Main Content */}
      <main className="flex-grow p-8 space-y-8">
        {/* Conditionally render the welcome section */}
        {activeSection === 'Stats' && (
          <section className="text-center">
            <h1 className="text-3xl font-bold text-white">Welcome, {userName}!</h1>
            <p className="mt-2 text-gray-400 text-lg">
              Track your performance and aim for the top!
            </p>
          </section>
        )}

        {renderActiveSection()}
      </main>
    </div>
  );
};

export default Home;
