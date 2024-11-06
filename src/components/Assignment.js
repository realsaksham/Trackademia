import React, { useState, useEffect } from 'react';
import { auth, db } from '../config/firebaseConfig';
import { collection, addDoc, getDocs, updateDoc, doc, increment } from 'firebase/firestore';

const Assignment = ({ onAuraPointsUpdated }) => {
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [assignments, setAssignments] = useState([]);
  const userId = auth.currentUser ? auth.currentUser.uid : null;

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
    if (title && dueDate && userId) {
      const newAssignment = {
        title,
        dueDate,
        status: 'Pending',
      };

      try {
        await addDoc(collection(db, 'users', userId, 'assignments'), newAssignment);
        setAssignments(prev => [...prev, newAssignment]);
        setTitle('');
        setDueDate('');
      } catch (error) {
        console.error("Error adding assignment: ", error);
      }
    }
  };

  // Mark assignment as completed and update AURA-POINTS
  const markAsCompleted = async (assignmentId) => {
    if (assignmentId && userId) {
      const assignmentRef = doc(db, 'users', userId, 'assignments', assignmentId);
      const userRef = doc(db, 'users', userId);
  
      try {
        // Mark the assignment as completed
        await updateDoc(assignmentRef, { status: 'Completed' });
  
        // Increment AURA-POINTS by 3
        await updateDoc(userRef, { auraPoints: increment(3) });
  
        // Notify Home component to refresh aura points
        onAuraPointsUpdated(); // Ensure this is passed correctly to the component
  
        console.log("Assignment marked as completed and AURA-POINTS updated");
      } catch (error) {
        console.error("Error updating document: ", error);
      }
    }
  };

  const currentAssignments = assignments.filter(assignment => assignment.status === 'Pending');
  const completedAssignments = assignments.filter(assignment => assignment.status === 'Completed');

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Add New Assignment</h2>
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
        <div key={assignment.id} className="mb-4 p-3 border rounded">
          <h3 className="text-lg font-bold">{assignment.title}</h3>
          <p>Due: {assignment.dueDate}</p>
          <p>Status: {assignment.status}</p>
          <button
            onClick={() => markAsCompleted(assignment.id)}
            className="bg-green-500 text-white px-2 py-1 rounded"
          >
            Submit
          </button>
        </div>
      ))}

      <h2 className="text-xl font-semibold mt-8">Completed Assignments</h2>
      {completedAssignments.map((assignment) => (
        <div key={assignment.id} className="mb-4 p-3 border rounded">
          <h3 className="text-lg font-bold">{assignment.title}</h3>
          <p>Due: {assignment.dueDate}</p>
          <p>Status: {assignment.status}</p>
        </div>
      ))}
    </div>
  );
};

export default Assignment;
