import React, { useState } from 'react';
import Login from './components/Login';
import Home from './components/Home';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <div className="App">
      {isAuthenticated ? <Home /> : <Login />}
    </div>
  );
}

export default App;
