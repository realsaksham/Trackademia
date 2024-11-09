import React, { useState, useEffect } from 'react';
import { auth, db } from '../config/firebaseConfig';
import { collection, doc, updateDoc, increment, onSnapshot } from 'firebase/firestore';

const Attendence = ({ onAuraPointsUpdated }) => {
  const [courses, setCourses] = useState([]);
  const [feedback, setFeedback] = useState("");
  const userId = auth.currentUser ? auth.currentUser.uid : null;

  useEffect(() => {
    if (userId) {
      const coursesCollection = collection(db, 'users', userId, 'courses');

      // Set up a real-time listener for courses
      const unsubscribe = onSnapshot(coursesCollection, (snapshot) => {
        const coursesList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCourses(coursesList);
      });

      // Clean up the listener on component unmount
      return () => unsubscribe();
    }
  }, [userId]);

  const updateAttendance = async (courseId, type) => {
    if (userId) {
      const courseRef = doc(db, 'users', userId, 'courses', courseId);
      const userRef = doc(db, 'users', userId);

      try {
        const fieldToUpdate = type === 'attended' ? 'attended' : 'absent';
        
        // Update attendance in the specific course document
        await updateDoc(courseRef, {
          [fieldToUpdate]: increment(1),
        });

        // Update auraPoints in the user document for "attended"
        if (type === 'attended') {
          await updateDoc(userRef, {
            auraPoints: increment(1),
          });
          onAuraPointsUpdated(); // Callback to update UI in parent component
        }

        // Set success feedback message
        setFeedback(`Attendance marked as ${type} successfully!`);
      } catch (error) {
        console.error("Error updating attendance: ", error);
        setFeedback("Error updating attendance. Please try again.");
      }

      // Clear feedback message after a short delay
      setTimeout(() => setFeedback(""), 3000);
    }
  };

  return (
    <div className="p-6 bg-black text-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold mb-6 border-b border-white pb-2">Mark Attendance</h2>
      {feedback && <p className="mb-4 text-green-400">{feedback}</p>}
      {courses.map(course => {
        const attended = course.attended || 0;
        const absent = course.absent || 0;
        const totalLectures = attended + absent;
        const attendancePercentage = totalLectures > 0 ? ((attended / totalLectures) * 100).toFixed(2) : 0;

        return (
          <div key={course.id} className="mb-4 p-4 border border-white rounded-lg">
            <h3 className="text-lg font-bold">{course.name}</h3>
            <p>Lectures Attended: {attended}</p>
            <p>Attendance Percentage: {attendancePercentage}%</p>
            <button
              onClick={() => updateAttendance(course.id, 'attended')}
              className="mt-3 px-4 py-2 mr-2 rounded bg-green-600 text-white transition-all duration-200 hover:bg-green-500 hover:shadow-[0_0_10px_#a3e635] focus:outline-none"
            >
              Attended
            </button>
            <button
              onClick={() => updateAttendance(course.id, 'absent')}
              className="mt-3 px-4 py-2 rounded bg-red-600 text-white transition-all duration-200 hover:bg-red-500 hover:shadow-[0_0_10px_#f87171] focus:outline-none"
            >
              Absent
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default Attendence;
