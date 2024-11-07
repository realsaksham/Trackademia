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
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Mark Attendance</h2>
      {courses.map(course => (
        <div key={course.id} className="mb-4 p-3 border rounded">
          <h3 className="text-lg font-bold">{course.name}</h3>
          <button
            onClick={markAttendance}
            className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
          >
            I am present
          </button>
        </div>
      ))}
    </div>
  );
};

export default Attendence;
