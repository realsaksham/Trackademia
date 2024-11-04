import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Home from './components/Home';
import { auth, googleProvider, githubProvider } from './config/firebaseConfig'; // Make sure this path matches your project structure

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Set up Firebase authentication listener
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsAuthenticated(!!user); // Set to true if user exists, false otherwise
    });

    // Cleanup subscription on component unmount
    return () => unsubscribe();
  }, []);

  return (
    <div className="App">
      {isAuthenticated ? <Home /> : <Login />}
    </div>
  );
}

export default App;
