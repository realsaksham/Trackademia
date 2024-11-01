import React from 'react';

const Login = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-indigo-600 flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-white shadow-md">
        <div className="flex items-center space-x-3">
          <img src="/path-to-your-logo.png" alt="Trackademia Logo" className="w-10 h-10" />
          <h1 className="text-xl font-bold text-indigo-600">Trackademia</h1>
        </div>
        <nav className="space-x-4">
          <a href="#" className="text-gray-600 hover:text-indigo-600">Home</a>
          <a href="#" className="text-gray-600 hover:text-indigo-600">About</a>
          <a href="#" className="text-gray-600 hover:text-indigo-600">Contact</a>
        </nav>
      </header>

      {/* Login Card */}
      <div className="flex items-center justify-center flex-grow">
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-xl space-y-6">
          {/* Logo and Title */}
          <div className="flex flex-col items-center mb-4">
            <img src="/path-to-your-logo.png" alt="Trackademia Logo" className="w-12 h-12" />
            <h2 className="mt-2 text-2xl font-bold text-gray-800">Welcome Back!</h2>
            <p className="text-gray-500">Log in to continue to Trackademia</p>
          </div>

          {/* Form */}
          <form className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full px-4 py-2 pl-10 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
                />
                <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.94 6.94A10 10 0 0118.06 16 10 10 0 012 8a10.24 10.24 0 01.94-1.06z" />
                  </svg>
                </span>
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  id="password"
                  name="password"
                  required
                  className="w-full px-4 py-2 pl-10 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
                />
                <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 12a2 2 0 01-2-2V7a2 2 0 114 0v3a2 2 0 01-2 2z" />
                  </svg>
                </span>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Sign in
            </button>
          </form>

          {/* OAuth Buttons */}
          <div className="space-y-2">
            <button className="w-full flex items-center justify-center px-4 py-2 text-gray-600 bg-white border rounded-md shadow-sm hover:bg-gray-50">
              <img src="/path-to-google-icon.png" alt="Google" className="w-5 h-5 mr-2" />
              Sign in with Google
            </button>
            <button className="w-full flex items-center justify-center px-4 py-2 text-gray-600 bg-white border rounded-md shadow-sm hover:bg-gray-50">
              <img src="/path-to-github-icon.png" alt="GitHub" className="w-5 h-5 mr-2" />
              Sign in with GitHub
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="p-4 bg-gray-100 text-center text-sm text-gray-500">
        © 2024 Trackademia. All rights reserved.
      </footer>
    </div>
  );
};

export default Login;
