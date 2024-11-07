import React, { useState, useEffect } from 'react';
import { auth, db } from '../config/firebaseConfig';
import { collection, addDoc, getDocs, updateDoc, doc, increment,getDoc } from 'firebase/firestore';

const Assignment = ({ onAuraPointsUpdated }) => {
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [assignments, setAssignments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
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

  // Fetch assignments from Firestore on component mount
  useEffect(() => {
    const fetchAssignments = async () => {
      if (userId) {
        const assignmentsCollection = collection(db, 'users', userId, 'assignments');
        const assignmentSnapshot = await getDocs(assignmentsCollection);
        const assignmentList = assignmentSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAssignments(assignmentList);
      }
    };

    fetchAssignments();
  }, [userId]);

  // Add new assignment to Firestore
  const addAssignment = async () => {
    if (title && dueDate && selectedCourseId && userId) {
      const newAssignment = {
        title,
        dueDate,
        status: 'Pending',
        courseId: selectedCourseId, // Associate assignment with selected course
      };

      try {
        await addDoc(collection(db, 'users', userId, 'assignments'), newAssignment);
        setAssignments(prev => [...prev, newAssignment]);
        setTitle('');
        setDueDate('');
        setSelectedCourseId('');
      } catch (error) {
        console.error("Error adding assignment: ", error);
      }
    }
  };

  // Mark assignment as completed and update AURA-POINTS
  // Mark assignment as completed and update AURA-POINTS based on course credit
const markAsCompleted = async (assignmentId, courseId) => {
  if (assignmentId && courseId && userId) {
    const assignmentRef = doc(db, 'users', userId, 'assignments', assignmentId);
    const userRef = doc(db, 'users', userId);
    const courseRef = doc(db, 'users', userId, 'courses', courseId);
    
    try {
      // Fetch the course to get its credit value
      const courseDoc = await getDoc(courseRef);
      if (courseDoc.exists()) {
        const courseData = courseDoc.data();
        const courseCredit = courseData.credit || 0;

        // Update the assignment status to 'Completed'
        await updateDoc(assignmentRef, { status: 'Completed' });
        
        // Update the user's AURA-POINTS based on the course's credit
        await updateDoc(userRef, { auraPoints: increment(courseCredit) });
        
        // Notify parent component about AURA-POINTS update
        onAuraPointsUpdated();
        console.log(`Assignment marked as completed and AURA-POINTS increased by ${courseCredit}`);
      } else {
        console.error("Course not found");
      }
    } catch (error) {
      console.error("Error updating document: ", error);
    }
    window.location.reload();
  }
}


  const currentAssignments = assignments.filter(assignment => assignment.status === 'Pending');
  const completedAssignments = assignments.filter(assignment => assignment.status === 'Completed');

  return (
    <div className="p-6 bg-[#1A1A1D] shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Add New Assignment</h2>
      <div className="mb-4">
        <label className="block text-gray-700">Course</label>
        <select
          value={selectedCourseId}
          onChange={(e) => setSelectedCourseId(e.target.value)}
          className="mt-1 p-2 border border-gray-300 rounded w-full"
        >
          <option value="">Select a Course</option>
          {courses.map(course => (
            <option key={course.id} value={course.id}>
              {course.name}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 p-2 border border-gray-300 rounded w-full"
          placeholder="Assignment Title"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Due Date</label>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="mt-1 p-2 border border-gray-300 rounded w-full"
        />
      </div>
      <button
        onClick={addAssignment}
        className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
      >
        Add Assignment
      </button>

      <h2 className="text-xl font-semibold mt-8">Current Assignments</h2>
        {currentAssignments.map((assignment) => (
          <div key={assignment.id} className="mb-4 p-3 border rounded"> {/* Add key here */}
            <h3 className="text-lg font-bold">{assignment.title}</h3>
            <p>Due: {assignment.dueDate}</p>
            <p>Status: {assignment.status}</p>
            <button
              onClick={() => markAsCompleted(assignment.id, assignment.courseId)}
              className="bg-green-500 text-white px-2 py-1 rounded"
            >
              Submit
            </button>
          </div>
        ))}

        <h2 className="text-xl font-semibold mt-8">Completed Assignments</h2>
        {completedAssignments.map((assignment) => (
          <div key={assignment.id} className="mb-4 p-3 border rounded"> {/* Add key here */}
            <h3 className="text-lg font-bold">{assignment.title}</h3>
            <p>Due: {assignment.dueDate}</p>
            <p>Status: {assignment.status}</p>
          </div>
        ))}

    </div>
  );
};

export default Assignment;
