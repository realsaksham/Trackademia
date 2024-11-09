import React, { useState, useEffect } from 'react';
import { auth, db } from '../config/firebaseConfig';
import { collection, addDoc, getDocs, updateDoc, doc, increment, getDoc } from 'firebase/firestore';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const Assignment = ({ onAuraPointsUpdated }) => {
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState(new Date());
  const [assignments, setAssignments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const userId = auth.currentUser ? auth.currentUser.uid : null;

  // Fetch Courses and Assignments
  useEffect(() => {
    const fetchData = async () => {
      if (!userId) return; // Ensure userId is available before fetching

      try {
        // Fetch Courses
        const coursesCollection = collection(db, 'users', userId, 'courses');
        const courseSnapshot = await getDocs(coursesCollection);
        const courseList = courseSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCourses(courseList);

        // Fetch Assignments
        const assignmentsCollection = collection(db, 'users', userId, 'assignments');
        const assignmentSnapshot = await getDocs(assignmentsCollection);
        const assignmentList = assignmentSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAssignments(assignmentList);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, [userId]);

  // Add Assignment Function
  const addAssignment = async () => {
    if (!title || !dueDate || !selectedCourseId || !userId) return;

    const newAssignment = {
      title,
      dueDate: dueDate.toISOString(),
      status: 'Pending',
      courseId: selectedCourseId,
    };

    try {
      const docRef = await addDoc(collection(db, 'users', userId, 'assignments'), newAssignment);
      setAssignments(prev => [...prev, { ...newAssignment, id: docRef.id }]);
      setTitle('');
      setDueDate(new Date());
      setSelectedCourseId('');
    } catch (error) {
      console.error("Error adding assignment: ", error);
    }
  };

  // Mark Assignment as Completed
  const markAsCompleted = async (assignmentId, courseId) => {
    if (!assignmentId || !courseId || !userId) return;

    const assignmentRef = doc(db, 'users', userId, 'assignments', assignmentId);
    const userRef = doc(db, 'users', userId);
    const courseRef = doc(db, 'users', userId, 'courses', courseId);

    try {
      const courseDoc = await getDoc(courseRef);
      if (!courseDoc.exists()) throw new Error("Course not found");

      const courseCredit = courseDoc.data().credit || 0;

      // Update assignment status and increment aura points
      await updateDoc(assignmentRef, { status: 'Completed' });
      await updateDoc(userRef, { auraPoints: increment(courseCredit) });

      // Update state and notify parent of aura points update
      setAssignments(prevAssignments =>
        prevAssignments.map(assignment =>
          assignment.id === assignmentId ? { ...assignment, status: 'Completed' } : assignment
        )
      );

      if (onAuraPointsUpdated) {
        onAuraPointsUpdated();
      }
    } catch (error) {
      console.error("Error marking assignment as completed: ", error);
    }
  };

  // Filtered assignment lists
  const currentAssignments = assignments.filter(assignment => assignment.status === 'Pending');
  const completedAssignments = assignments.filter(assignment => assignment.status === 'Completed');

  return (
    <div className="p-6 bg-[#1A1A1D] text-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Add New Assignment</h2>

      <div className="mb-4">
        <label className="block">Course</label>
        <select
          value={selectedCourseId}
          onChange={(e) => setSelectedCourseId(e.target.value)}
          className="mt-1 p-2 border border-white rounded w-full bg-transparent text-white placeholder-gray-400 hover:border-[#C3A8F2] focus:outline-none transition-all"
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
        <label className="block">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 p-2 border border-white rounded w-full bg-transparent text-white placeholder-gray-400 hover:border-[#C3A8F2] focus:outline-none transition-all"
          placeholder="Assignment Title"
        />
      </div>

      <div className="mb-4">
        <label className="block">Due Date and Time</label>
        <DatePicker
          selected={dueDate}
          onChange={(date) => setDueDate(date)}
          showTimeSelect
          minDate={new Date()}
          dateFormat="Pp"
          className="mt-1 p-2 border border-white rounded w-full bg-transparent text-white placeholder-gray-400 hover:border-[#C3A8F2] focus:outline-none transition-all"
        />
      </div>

      <button
        onClick={addAssignment}
        className="bg-blue-500 text-white px-4 py-2 rounded mt-2 hover:bg-[#C3A8F2] hover:shadow-xl transition-all"
      >
        Add Assignment
      </button>

      <h2 className="text-xl font-semibold mt-8">Current Assignments</h2>
      {currentAssignments.map((assignment) => (
        <div key={assignment.id} className="mb-4 p-3 border border-white rounded hover:bg-[#C3A8F2] hover:shadow-lg transition-all">
          <h3 className="text-lg font-bold">{assignment.title}</h3>
          <p>Due: {new Date(assignment.dueDate).toLocaleString()}</p>
          <button
            onClick={() => markAsCompleted(assignment.id, assignment.courseId)}
            className="bg-green-500 text-white px-2 py-1 rounded hover:bg-[#C3A8F2] transition-all"
          >
            Submit
          </button>
        </div>
      ))}

      <h2 className="text-xl font-semibold mt-8">Completed Assignments</h2>
      {completedAssignments.map((assignment) => (
        <div key={assignment.id} className="mb-4 p-3 border border-white rounded hover:bg-[#C3A8F2] hover:shadow-lg transition-all">
          <h3 className="text-lg font-bold">{assignment.title}</h3>
          <p>Due: {new Date(assignment.dueDate).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
};

export default Assignment;
