import React, { useEffect, useState } from 'react';
import { auth, db } from '../config/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

const AssignmentAlert = () => {
  const [urgentAssignments, setUrgentAssignments] = useState([]);
  const userId = auth.currentUser ? auth.currentUser.uid : null;

  useEffect(() => {
    const fetchUrgentAssignments = async () => {
      if (!userId) return;

      const sixHoursFromNow = new Date().getTime() + 6 * 60 * 60 * 1000;

      try {
        const assignmentsCollection = collection(db, 'users', userId, 'assignments');
        const assignmentSnapshot = await getDocs(assignmentsCollection);
        const assignmentsList = assignmentSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        const filteredAssignments = assignmentsList.filter(
          (assignment) =>
            assignment.status === 'Pending' &&
            new Date(assignment.dueDate).getTime() <= sixHoursFromNow
        );

        setUrgentAssignments(filteredAssignments);
      } catch (error) {
        console.error("Error fetching assignments: ", error);
      }
    };

    fetchUrgentAssignments();
  }, [userId]);

  const calculateTimeLeft = (dueDate) => {
    const now = new Date().getTime();
    const dueTime = new Date(dueDate).getTime();
    const timeDifference = dueTime - now;

    const hours = Math.floor(timeDifference / (1000 * 60 * 60));
    const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours > 0 ? `${hours} hours ` : ''}${minutes} minutes left`;
  };

  if (urgentAssignments.length === 0) {
    return null; // Render nothing if there are no urgent assignments
  }

  return (
    <div className="p-4 bg-red-600 text-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-2">Assignments Due Soon</h2>
      <ul>
        {urgentAssignments.map((assignment) => (
          <li key={assignment.id} className="mb-2">
            Assignment <strong>{assignment.title}</strong> - {calculateTimeLeft(assignment.dueDate)}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AssignmentAlert;
