import React, { useEffect, useState } from 'react';
import { auth, db } from '../config/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, getDocs, collection, query, where } from 'firebase/firestore';
import Sidebar from './Sidebar';
import Stats from './Stats';
import Leaderboard from './Leaderboard';
import Assignment from './Assignment.js';
import Courses from './Courses.js';
import Attendence from './Attendence.js';
import AssignmentAlert from './AssignmentAlert';
import Card from './Card.js'; // Import the Card component

const Home = () => {
  const [userName, setUserName] = useState('');
  const [auraPoints, setAuraPoints] = useState(0);
  const [present, setPresent] = useState(0);
  const [assignments, setAssignments] = useState([]);
  const [activeSection, setActiveSection] = useState('Home');
  const [sidebarVisible, setSidebarVisible] = useState(false);
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

  const handleMouseLeave = () => {
    setSidebarVisible(false);
  };

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'Stats':
        return <Stats auraPoints={auraPoints} attendance={present} completedAssignments={assignments.length} />;
      case 'Leaderboard':
        return (
          <section>
            <h2 className="text-2xl font-semibold text-white text-center">Leaderboard</h2>
            <Leaderboard />
          </section>
        );
      case 'Assignments':
        return <Assignment onAuraPointsUpdated={fetchAuraPoints} />;
      case 'Courses':
        return <Courses />;
      case 'Attendence':
        return <Attendence onAuraPointsUpdated={fetchAuraPoints} />;
      case 'Home':
      default:
        return (
          <section className="text-center">
            <h1 className="text-7xl font-bold text-white">Welcome to<h1 className="text-7xl font-bold text-violet-800">TRACKADEMIA!</h1></h1> 
            <p className="mt-2 text-gray-400 text-lg">
              it's never been that easy to study 
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <Card title="Stats" onClick={() => setActiveSection('Stats')} />
              <Card title="Leaderboard" onClick={() => setActiveSection('Leaderboard')} />
              <Card title="Assignments" onClick={() => setActiveSection('Assignments')} />
              <Card title="Courses" onClick={() => setActiveSection('Courses')} />
              <Card title="Attendence" onClick={() => setActiveSection('Attendence')} />
            </div>
          </section>
        );
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex">
      <button 
        onMouseEnter={() => setSidebarVisible(true)}
        className="text-black tracking-widest bg-transparent hover:bg-[#616467] transition duration-200"
      >
        {sidebarVisible ? '--' : '--'}
      </button>

      <Sidebar 
        id="sidebar"
        activeSection={activeSection} 
        setActiveSection={setActiveSection} 
        sidebarVisible={sidebarVisible} 
        setSidebarVisible={setSidebarVisible} 
        onMouseLeave={handleMouseLeave}
      />
      <div>
        <AssignmentAlert assignments={assignments} />
      </div>

      <main className="flex-grow p-8 space-y-8">
        {renderActiveSection()}
      </main>
    </div>
  );
};

export default Home;
