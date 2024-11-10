import React, { useState, useEffect } from 'react';
import { auth, db } from '../config/firebaseConfig';
import { collection, doc, updateDoc, increment, onSnapshot } from 'firebase/firestore';
import './Attendence.css';
import { Chart } from 'primereact/chart';

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

  const renderDoughnutChart = (attended, absent) => {
    const documentStyle = getComputedStyle(document.documentElement);
    const data = {
      labels: ['Attended', 'Absent'],
      datasets: [
        {
          data: [attended, absent],
          backgroundColor: [
            '#28a745', // Green for attended
            '#dc3545'
          ],
          hoverBackgroundColor: [
            '#218838', // Darker green for hover
            '#c82333' 
          ]
        }
      ]
    };
    const options = {
      cutout: '60%',
    };
    
    return <Chart type="doughnut" data={data} options={options} className="attendance-chart" />;
  };

  return (
    <div className="attendance-container">
      <h2 className="attendance-header">Mark Attendance</h2>
      {feedback && <p className="feedback-message">{feedback}</p>}
      {courses.map(course => {
        const attended = course.attended || 0;
        const absent = course.absent || 0;
        const totalLectures = attended + absent;
        const attendancePercentage = totalLectures > 0 ? ((attended / totalLectures) * 100).toFixed(2) : 0;

        return (
          <div key={course.id} className="course-item">
            <h3 className="course-name">{course.name}</h3>
            <p className="attendance-info">Lectures Attended: {attended}</p>
            <p className="attendance-info">Attendance Percentage: {attendancePercentage}%</p>
            <div className="buttons-container">
              <button
                onClick={() => updateAttendance(course.id, 'attended')}
                className="attendance-btn attended-btn"
              >
                Attended
              </button>
              <button
                onClick={() => updateAttendance(course.id, 'absent')}
                className="attendance-btn absent-btn"
              >
                Absent
              </button>
            </div>

            {/* Render the Doughnut chart for attendance */}
            <div className="attendance-chart-container">
              {renderDoughnutChart(attended, absent)}
            </div>

          </div>
        );
      })}
    </div>
  );
};

export default Attendence;
