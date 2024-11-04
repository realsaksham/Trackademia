// src/components/AssignmentList.js

import React, { useState, useEffect } from 'react';
import { db } from '../config/firebaseConfig';
import { collection, addDoc, getDocs, query, orderBy } from 'firebase/firestore';

const AssignmentList = () => {
  const [assignments, setAssignments] = useState([]);
  const [newAssignmentTitle, setNewAssignmentTitle] = useState('');
  const [newAssignmentDueDate, setNewAssignmentDueDate] = useState('');

  // Fetch assignments from Firestore
  useEffect(() => {
    const fetchAssignments = async () => {
      const assignmentsRef = collection(db, 'assignments');
      const q = query(assignmentsRef, orderBy('dueDate', 'asc'));
      const querySnapshot = await getDocs(q);
      const assignmentsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setAssignments(assignmentsData);
    };
    fetchAssignments();
  }, []);

  // Add a new assignment to Firestore
  const addAssignment = async () => {
    if (newAssignmentTitle && newAssignmentDueDate) {
      const newAssignment = {
        title: newAssignmentTitle,
        dueDate: newAssignmentDueDate,
        status: 'Pending'
      };
      await addDoc(collection(db, 'assignments'), newAssignment);
      setAssignments(prev => [...prev, newAssignment]);
      setNewAssignmentTitle('');
      setNewAssignmentDueDate('');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Assignments</h2>
      
      {/* Assignment Input Form */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Assignment Title"
          value={newAssignmentTitle}
          onChange={(e) => setNewAssignmentTitle(e.target.value)}
          className="block w-full p-2 mb-2 border rounded"
        />
        <input
          type="date"
          value={newAssignmentDueDate}
          onChange={(e) => setNewAssignmentDueDate(e.target.value)}
          className="block w-full p-2 mb-2 border rounded"
        />
        <button
          onClick={addAssignment}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          Add Assignment
        </button>
      </div>

      {/* Display Assignments */}
      <div>
        {assignments.map((assignment) => (
          <div key={assignment.id} className="mb-4 p-3 border rounded">
            <h3 className="text-lg font-bold">{assignment.title}</h3>
            <p>Due: {assignment.dueDate}</p>
            <p>Status: {assignment.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AssignmentList;
