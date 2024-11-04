import React, { useEffect, useState } from 'react';
import { auth } from '../config/firebaseConfig'; // Adjust the import path as needed
import { onAuthStateChanged } from 'firebase/auth';
//import Header from './Header';
import StatsCard from './StatsCard';
import Leaderboard from './Leaderboard';
import Footer from './Footer';

const Home = () => {
  const [userName, setUserName] = useState('');

  useEffect(() => {
    // Listener to get the logged-in user
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserName(user.displayName || 'User'); // Default to 'User' if no displayName
      } else {
        setUserName(''); // Clear name if no user is logged in
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* <Header /> */}
      <main className="flex-grow p-8 space-y-8">
        {/* Welcome Section */}
        <section className="text-center">
          <h1 className="text-3xl font-bold text-gray-800">Welcome, {userName}!</h1>
          <p className="mt-2 text-gray-600 text-lg">
            Track your performance and aim for the top!
          </p>
        </section>

        {/* Stats Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatsCard title="Aura Points" value="2000" />
          <StatsCard title="Completed Assignments" value="35" />
          <StatsCard title="Current Ranking" value="#5" />
        </section>

        {/* Leaderboard Section */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 text-center">Leaderboard</h2>
          <Leaderboard />
        </section>

        {/* Additional Information Section */}
        <section className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-800">Upcoming Assignments</h3>
          <ul className="mt-4 space-y-2 text-left text-gray-700">
            <li className="flex justify-between">
              <span>Math Assignment</span>
              <span className="font-bold">Due: Nov 10</span>
            </li>
            <li className="flex justify-between">
              <span>Science Project</span>
              <span className="font-bold">Due: Nov 12</span>
            </li>
            <li className="flex justify-between">
              <span>History Essay</span>
              <span className="font-bold">Due: Nov 15</span>
            </li>
          </ul>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
