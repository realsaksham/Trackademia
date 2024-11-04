import React, { useState } from 'react';
import { auth, googleProvider, githubProvider, db } from '../config/firebaseConfig'; // Import Firestore db
import { signInWithEmailAndPassword, signInWithPopup, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from "firebase/firestore"; // Import Firestore functions
import './Login.css'; // Import your CSS file

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSignup, setIsSignup] = useState(false); // Track if the user is signing up
    const [displayName, setDisplayName] = useState('');

    const handleLogin = async (event) => {
        event.preventDefault();
        setError(''); // Clear previous errors
        try {
            await signInWithEmailAndPassword(auth, email, password);
            console.log("Login successful");
            // Redirect or perform additional actions after successful login
        } catch (err) {
            console.error("Login error:", err);
            setError(err.message); // Display error message
        }
    };

    const handleSignup = async (event) => {
        event.preventDefault(); // Prevent default form submission
        setError(''); // Clear previous errors
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Use user.uid as the document ID in Firestore
            await setDoc(doc(db, "users", user.uid), {
                email: user.email,
                displayName: displayName, // Add a default displayName or retrieve it from user input
                createdAt: new Date(),
            });

            console.log("User signed up and data saved to Firestore:", user);
            setDisplayName('');
        } catch (error) {
            console.error("Signup error:", error);
            setError(error.message); // Display error message
        }
    };

    const handleGoogleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;

            // Save user information to Firestore if needed
            await setDoc(doc(db, "users", user.uid), {
                email: user.email,
                displayName: user.displayName || "", // Use displayName from Google
                createdAt: new Date(),
            });

            console.log("Logged in with Google:", user);
        } catch (err) {
            console.error("Google login error:", err);
            setError(err.message); // Display error message
        }
    };

    const handleGithubLogin = async () => {
        try {
            const result = await signInWithPopup(auth, githubProvider);
            const user = result.user;

            // Save user information to Firestore if needed
            await setDoc(doc(db, "users", user.uid), {
                email: user.email,
                displayName: user.displayName || "", // Use displayName from GitHub
                createdAt: new Date(),
            });

            console.log("Logged in with GitHub:", user);
        } catch (err) {
            console.error("GitHub login error:", err);
            setError(err.message); // Display error message
        }
    };

    return (
      <div className="min-h-screen bg-gradient-to-r flex flex-col">
          <div className="login-card">
              <div className="card">
                  <div className="flex flex-col items-center mb-4">
                      <img src="/path-to-your-logo.png" alt="Trackademia Logo" className="w-12 h-12" />
                      <h2 className="mt-2 text-2xl font-bold text-gray-800">{isSignup ? "Create an Account" : "Welcome Back!"}</h2>
                      <p className="text-gray-500">{isSignup ? "Sign up to continue to Trackademia" : "Log in to continue to Trackademia"}</p>
                  </div>

                  {error && <p className="error-message">{error}</p>}

                  <form className="space-y-4" onSubmit={isSignup ? handleSignup : handleLogin}>
                      {isSignup && (
                          <div>
                              <label htmlFor="displayName" className="block text-sm font-medium text-gray-700">Display Name</label>
                              <input
                                  type="text"
                                  id="displayName"
                                  required={isSignup}
                                  value={displayName}
                                  onChange={(e) => setDisplayName(e.target.value)}
                                  className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
                              />
                          </div>
                      )}
                      <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
                          <input
                              type="email"
                              id="email"
                              required
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
                          />
                      </div>

                      <div>
                          <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                          <input
                              type="password"
                              id="password"
                              required
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
                          />
                      </div>

                      <button type="submit" className="w-full px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                          {isSignup ? "Sign Up" : "Sign In"}
                      </button>
                  </form>

                  <div className="space-y-2">
                      <button onClick={handleGoogleLogin} className="w-full flex items-center justify-center px-4 py-2 text-gray-600 bg-white border rounded-md shadow-sm hover:bg-gray-50">
                          <img src="../img/googlelogo.png" alt="Google" className="w-5 h-5 mr-2" />
                          Sign in with Google
                      </button>
                      <button onClick={handleGithubLogin} className="w-full flex items-center justify-center px-4 py-2 text-gray-600 bg-white border rounded-md shadow-sm hover:bg-gray-50">
                          <img src="../img/githublogo.png" alt="GitHub" className="w-5 h-5 mr-2" />
                          Sign in with GitHub
                      </button>
                  </div>

                  <div className="mt-4">
                      <button onClick={() => setIsSignup(!isSignup)} className="text-indigo-600 hover:text-indigo-700">
                          {isSignup ? "Already have an account? Log in" : "Don't have an account? Sign up"}
                      </button>
                  </div>
              </div>
          </div>

          <footer className="footer">© 2024 Trackademia. All rights reserved.</footer>
      </div>
  );
};

export default Login;
