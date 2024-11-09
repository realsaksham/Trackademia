import React, { useState, useEffect } from 'react';
import { auth, db } from '../config/firebaseConfig';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import './Courses.css'; // Import the CSS file

const Courses = () => {
  const [courseName, setCourseName] = useState('');
  const [courseCredit, setCourseCredit] = useState('');
  const [courses, setCourses] = useState([]);

  const userId = auth.currentUser ? auth.currentUser.uid : null;

  // Fetch courses from Firestore on component mount
  useEffect(() => {
    const fetchCourses = async () => {
      if (userId) {
        const coursesCollection = collection(db, 'users', userId, 'courses');
        const courseSnapshot = await getDocs(coursesCollection);
        const courseList = courseSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCourses(courseList);
      }
    };

    fetchCourses();
  }, [userId]);

  // Add new course to Firestore
  const addCourse = async () => {
    if (courseName && courseCredit && userId) {
      const newCourse = {
        name: courseName,
        credit: courseCredit,
      };

      try {
        const docRef = await addDoc(collection(db, 'users', userId, 'courses'), newCourse);
        setCourses(prev => [...prev, { id: docRef.id, ...newCourse }]);
        setCourseName(''); // Clear input after submit
        setCourseCredit(''); // Clear input after submit
      } catch (error) {
        console.error("Error adding course: ", error);
      }
    }
  };

  return (
    <div className="courses-container">
      {/* Course Name Input */}
      <div className="input-container">
        <label className="input-label">Course Name</label>
        <input
          type="text"
          value={courseName}
          onChange={(e) => setCourseName(e.target.value)}
          className="input-field"
          placeholder="Enter Course Name"
        />
      </div>

      {/* Course Credit Input */}
      <div className="input-container">
        <label className="input-label">Course Credit</label>
        <input
          type="text"
          value={courseCredit}
          onChange={(e) => {
            if (/^\d*$/.test(e.target.value)) setCourseCredit(e.target.value);
          }}
          inputMode="numeric"
          className="input-field"
          placeholder="Enter Course Credit"
        />
      </div>

      {/* Add Course Button */}
      <button
        onClick={addCourse}
        className="add-course-btn"
      >
        Add Course
      </button>

      {/* Display Courses */}
      <h2 className="courses-list-header">Your Courses</h2>
      <ul className="courses-list">
        {courses.map(course => (
          <li key={course.id} className="course-item">
            <span className="course-name">{course.name}</span> {course.credit}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Courses;
