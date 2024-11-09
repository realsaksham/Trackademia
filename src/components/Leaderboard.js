import React, { useState, useEffect } from 'react';
import { db } from '../config/firebaseConfig';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

const Leaderboard = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const usersCollection = collection(db, 'users');
    const usersQuery = query(usersCollection, orderBy('auraPoints', 'desc'));

    const unsubscribe = onSnapshot(usersQuery, (snapshot) => {
      const usersList = snapshot.docs.map((doc) => ({
        id: doc.id,
        displayName: doc.data().displayName,
        auraPoints: doc.data().auraPoints,
      }));
      setUsers(usersList);
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  return (
    <div className="p-6 bg-[#121212] text-white shadow-lg rounded-xl flex flex-col items-center">
     
      <ul className="w-full max-w-md space-y-4">
        {users.map((user, index) => (
          <li
            key={user.id}
            className="flex justify-between items-center bg-[#1e1e1e] border border-[#444] p-4 rounded-lg shadow-sm transition-all duration-300 hover:bg-[#252525] hover:shadow-lg"
          >
            <span className="text-xl">
              {index + 1}. {user.displayName || 'Anonymous'}
            </span>
            <span className="text-2xl font-semibold text-[#C3A8F2]">
              {user.auraPoints} points
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Leaderboard;
