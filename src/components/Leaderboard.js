import React, { useState, useEffect } from 'react';
import { db } from '../config/firebaseConfig';
import { collection, getDocs, onSnapshot, query, orderBy } from 'firebase/firestore';

const Leaderboard = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const usersCollection = collection(db, 'users');
    const usersQuery = query(usersCollection, orderBy('auraPoints', 'desc'));

    // Listen for real-time updates
    const unsubscribe = onSnapshot(usersQuery, (snapshot) => {
      const usersList = snapshot.docs.map(doc => ({
        id: doc.id,
        displayName: doc.data().displayName,
        auraPoints: doc.data().auraPoints
      }));
      setUsers(usersList);
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  return (
    <div className="p-4 bg-[#1A1A1D] shadow rounded-lg">
      <h2 className="text-2xl text-[#EBD3F8] font-semibold mb-4">Leaderboard</h2>
      <ul className="mt-4 space-y-3">
        {users.map((user, index) => (
          <li key={user.id} className="flex justify-between text-white">
            <span>{index + 1}. {user.displayName || 'Anonymous'}</span>
            <span className='text-[#EBD3F8]'>{user.auraPoints} points</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Leaderboard;
