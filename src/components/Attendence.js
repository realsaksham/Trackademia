import React, { useState, useEffect } from 'react';
import { auth, db } from '../config/firebaseConfig';
import { collection, getDocs, doc, updateDoc, increment } from 'firebase/firestore';

const Attendence = ({ onAuraPointsUpdated }) => {
  const [courses, setCourses] = useState([]);
  const userId = auth.currentUser ? auth.currentUser.uid : null;

  useEffect(() => {
    const fetchCourses = async () => {
      if (userId) {
        const coursesCollection = collection(db, 'users', userId, 'courses');
        const courseSnapshot = await getDocs(coursesCollection);
        const coursesList = courseSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCourses(coursesList);
      }
    };
    fetchCourses();
  }, [userId]);

  const markAttendance = async () => {
    if (userId) {
      const userRef = doc(db, 'users', userId);
      try {
        await updateDoc(userRef, {
          attendance: increment(1),
          auraPoints: increment(1),
        });
        onAuraPointsUpdated(); // Update aura points in Home
      } catch (error) {
        console.error("Error updating attendance: ", error);
      }
    }
  };

  return (
    <div className="p-6 bg-black text-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold mb-6 border-b border-white pb-2">Mark Attendance</h2>
      {courses.map(course => (
        <div key={course.id} className="mb-4 p-4 border border-white rounded-lg">
          <h3 className="text-lg font-bold">{course.name}</h3>
          <button
            onClick={markAttendance}
            className="mt-3 px-4 py-2 rounded bg-purple-600 text-white transition-all duration-200 hover:bg-purple-500 hover:shadow-[0_0_10px_#d3b8ff] focus:outline-none"
          >
            I am present
          </button>
        </div>
      ))}
    </div>
  );
};

export default Attendence;
