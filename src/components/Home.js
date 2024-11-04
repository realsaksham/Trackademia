import React, { useEffect, useState } from 'react';
import { auth, db } from '../config/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import StatsCard from './StatsCard';
import Leaderboard from './Leaderboard';
import Footer from './Footer';
import Assignment from './Assignment.js';
import Timetable from './Timetable.js';
import '../App.css';
import AssignmentList from './AssignmentList';

const Home = () => {
  const [userName, setUserName] = useState('');
  const [activeSection, setActiveSection] = useState('Stats'); // Track active view

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setUserName(userDoc.data().displayName || 'User');
        } else {
          setUserName('User');
        }
      } else {
        setUserName('');
      }
    });

    return () => unsubscribe();
  }, []);

  // Render based on active section
  const renderActiveSection = () => {
    switch (activeSection) {
      case 'Stats':
        return (
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatsCard title="Aura Points" value="2000" />
            <StatsCard title="Completed Assignments" value="35" />
            <StatsCard title="Current Ranking" value="#5" />
          </section>
        );
      case 'Leaderboard':
        return (
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 text-center">Leaderboard</h2>
            <Leaderboard />
          </section>
        );
      case 'Assignments':
        return <Assignment />; // Render Assignment component
      case 'Timetable':
        return <Timetable />; // Render Timetable component
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-indigo-700 text-white flex flex-col">
        <div className="p-4 text-2xl font-bold">Trackademia</div>
        <nav className="flex-grow">
          <ul>
            <li
              onClick={() => setActiveSection('Stats')}
              className={`p-4 cursor-pointer ${activeSection === 'Stats' ? 'bg-indigo-600' : ''}`}
            >
              Stats
            </li>
            <li
              onClick={() => setActiveSection('Leaderboard')}
              className={`p-4 cursor-pointer ${activeSection === 'Leaderboard' ? 'bg-indigo-600' : ''}`}
            >
              Leaderboard
            </li>
            <li
              onClick={() => setActiveSection('Assignments')}
              className={`p-4 cursor-pointer ${activeSection === 'Assignments' ? 'bg-indigo-600' : ''}`}
            >
              Assignments
            </li>
            <li
              onClick={() => setActiveSection('Timetable')}
              className={`p-4 cursor-pointer ${activeSection === 'Timetable' ? 'bg-indigo-600' : ''}`}
            >
              Timetable
            </li>
            <li
              onClick={() => setActiveSection('Timetable')}
              className={`p-4 cursor-pointer ${activeSection === 'Timetable' ? 'bg-indigo-600' : ''}`}
            >
              Course
            </li>
          </ul>
        </nav>
        <footer className="p-4 text-center">© 2024 Trackademia</footer>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-8 space-y-8">
        <section className="text-center">
          <h1 className="text-3xl font-bold text-gray-800">Welcome, {userName}!</h1>
          <p className="mt-2 text-gray-600 text-lg">
            Track your performance and aim for the top!
          </p>
        </section>

        {renderActiveSection()} {/* Conditionally render based on the selected section */}
      </main>
    </div>
  );
};

export default Home;
