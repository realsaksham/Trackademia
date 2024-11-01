import React from 'react';
import Header from './Header';
import StatsCard from './StatsCard';
import Leaderboard from './Leaderboard';
import Footer from './Footer';

const Home = () => (
  <div className="min-h-screen bg-gray-100 flex flex-col">
    <Header />
    <main className="flex-grow p-8 space-y-6">
      {/* Welcome Section */}
      <section className="text-center">
        <h1 className="text-2xl font-bold text-gray-800">Welcome, [User’s Name]!</h1>
        <p className="text-gray-600">Track your performance and aim for the top!</p>
      </section>

      {/* Stats Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatsCard title="Aura Points" value="2000" />
        <StatsCard title="Completed Assignments" value="35" />
        <StatsCard title="Current Ranking" value="#5" />
      </section>

      {/* Leaderboard Section */}
      <Leaderboard />
    </main>
    <Footer />
  </div>
);

export default Home;
