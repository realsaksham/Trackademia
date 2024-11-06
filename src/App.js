// App.js
import React, { useState, useEffect } from 'react';
import { auth } from './config/firebaseConfig'; // Adjust the path as needed
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Home from './components/Home';
import Header from './components/Header'; // Import your Header component

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null); // Store user information

  useEffect(() => {
    // Set up Firebase authentication listener
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsAuthenticated(user); // Set to true if user exists
      setUser(user); // Update user state
    });

    // Cleanup subscription on component unmount
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut(); // Sign out from Firebase
      setIsAuthenticated(false); // Update authentication state
      setUser(null); // Clear user state
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="App">
      {/* Render Header component */}
      <Header user={user} onLogout={handleLogout} />
      <Routes>
        {isAuthenticated ? (  
          <Route path="/" element={<Home user={user} />} />
        ) : (
          <Route path="/login" element={<Login />} />
        )}
        <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} />} />
      </Routes>
    </div>
  );
}

export default App;
