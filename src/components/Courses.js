import React, { useState, useEffect } from 'react';
import { auth, db } from '../config/firebaseConfig';
import { collection, addDoc, getDocs } from 'firebase/firestore';

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
    <div className="p-6 bg-black text-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Add Your Course</h2>

      {/* Course Name Input */}
      <div className="mb-4">
        <label className="block text-white">Course Name</label>
        <input
          type="text"
          value={courseName}
          onChange={(e) => setCourseName(e.target.value)}
          className="mt-1 p-2 border border-white rounded w-full bg-transparent text-white placeholder-gray-400 hover:border-[#C3A8F2] focus:outline-none transition-all"
          placeholder="Enter Course Name"
        />
      </div>

      {/* Course Credit Input */}
      <div className="mb-4">
        <label className="block text-white">Course Credit</label>
        <input
          type="text"
          value={courseCredit}
          onChange={(e) => {
            if (/^\d*$/.test(e.target.value)) setCourseCredit(e.target.value);
          }}
          inputMode="numeric"
          className="mt-1 p-2 border border-white rounded w-full bg-transparent text-white placeholder-gray-400 hover:border-[#C3A8F2] focus:outline-none transition-all"
          placeholder="Enter Course Credit"
        />
      </div>

      {/* Add Course Button */}
      <button
        onClick={addCourse}
        className="bg-blue-500 text-white px-4 py-2 rounded mt-2 hover:bg-[#C3A8F2] hover:shadow-xl transition-all"
      >
        Add Course
      </button>

      {/* Display Courses */}
      <h2 className="text-xl font-semibold mt-8">Your Courses</h2>
      <ul className="mt-4 space-y-2">
        {courses.map(course => (
          <li key={course.id} className="p-3 border border-white rounded hover:bg-[#C3A8F2] hover:shadow-lg transition-all">
            <span className="font-bold">{course.name}</span> - Credit: {course.credit}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Courses;
