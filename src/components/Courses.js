import React, { useState, useEffect } from 'react';
import { auth, db } from '../config/firebaseConfig';
import { collection, addDoc, getDocs, updateDoc, doc } from 'firebase/firestore';

const Courses = () => {
  const [courseName, setCourseName] = useState('');
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [selectedCourseName, setSelectedCourseName] = useState(''); // Store selected course name
  const [chapters, setChapters] = useState([]);
  const [newChapter, setNewChapter] = useState('');

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
    if (courseName && userId) {
      const newCourse = {
        name: courseName,
        chapters: [], // Initialize with empty chapters
      };

      try {
        const docRef = await addDoc(collection(db, 'users', userId, 'courses'), newCourse);
        setCourses(prev => [...prev, { id: docRef.id, ...newCourse }]);
        setCourseName(''); // Clear input after submit
      } catch (error) {
        console.error("Error adding course: ", error);
      }
    }
  };

  // Fetch chapters for selected course
  const fetchChapters = async (courseId, courseName) => {
    if (courseId) {
      const chaptersCollection = collection(db, 'users', userId, 'courses', courseId, 'chapters');
      const chapterSnapshot = await getDocs(chaptersCollection);
      const chapterList = chapterSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setChapters(chapterList);
      setSelectedCourseId(courseId);
      setSelectedCourseName(courseName); // Set the selected course name
    }
  };

  // Add a new chapter to the selected course
  const addChapter = async () => {
    if (newChapter && selectedCourseId) {
      const newChapterData = {
        name: newChapter,
        completed: false, // Default completed status
      };

      try {
        await addDoc(collection(db, 'users', userId, 'courses', selectedCourseId, 'chapters'), newChapterData);
        
        // Update local chapters state after adding the chapter to Firestore
        setChapters(prev => [...prev, newChapterData]);
        setNewChapter(''); // Clear input after adding chapter
      } catch (error) {
        console.error("Error adding chapter: ", error);
      }
    }
  };

  // Toggle chapter completion status
  const toggleChapterCompletion = async (chapterId, currentStatus) => {
    const chapterRef = doc(db, 'users', userId, 'courses', selectedCourseId, 'chapters', chapterId);
    try {
      await updateDoc(chapterRef, { completed: !currentStatus });
      setChapters(prev =>
        prev.map(chapter =>
          chapter.id === chapterId ? { ...chapter, completed: !currentStatus } : chapter
        )
      );
    } catch (error) {
      console.error("Error updating chapter status: ", error);
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Add Your Course</h2>
      <div className="mb-4">
        <label className="block text-gray-700">Course Name</label>
        <input
          type="text"
          value={courseName}
          onChange={(e) => setCourseName(e.target.value)}
          className="mt-1 p-2 border border-gray-300 rounded w-full"
          placeholder="Enter Course Name"
        />
      </div>
      <button
        onClick={addCourse}
        className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
      >
        Add Course
      </button>

      <h2 className="text-xl font-semibold mt-8">Your Courses</h2>
      <select
        value={selectedCourseId || ''}
        onChange={(e) => {
          const selectedCourse = courses.find(course => course.id === e.target.value);
          fetchChapters(e.target.value, selectedCourse.name);
        }}
        className="mt-2 p-2 border border-gray-300 rounded w-full"
      >
        <option value="">Select a Course</option>
        {courses.map(course => (
          <option key={course.id} value={course.id}>
            {course.name}
          </option>
        ))}
      </select>

      {selectedCourseId && (
        <>
          <h2 className="text-xl font-semibold mt-8">Chapters for: {selectedCourseName}</h2>
          <div className="mb-4">
            <label className="block text-gray-700">Add Chapter</label>
            <input
              type="text"
              value={newChapter}
              onChange={(e) => setNewChapter(e.target.value)}
              className="mt-1 p-2 border border-gray-300 rounded w-full"
              placeholder="Enter Chapter Name"
            />
          </div>
          <button
            onClick={addChapter}
            className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
          >
            Add Chapter
          </button>

          {chapters.map(chapter => (
            <div key={chapter.id} className="mb-4 flex items-center">
              <input
                type="checkbox"
                checked={chapter.completed}
                onChange={() => toggleChapterCompletion(chapter.id, chapter.completed)}
                className="mr-2"
              />
              <span className={chapter.completed ? 'line-through' : ''}>{chapter.name}</span>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default Courses;
