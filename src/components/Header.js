import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';

const Header = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await onLogout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header className="header-container">
      <div className="header-logo">
        <img src="/path-to-your-logo.png" alt="Trackademia Logo" className="logo-image" />
        <h1 className="header-title">TRACKADEMIA</h1>
      </div>
      
      <nav className="header-nav">
        {/* Use Link for Home Button to avoid page refresh */}
        <Link to="/home" className="header-button">
          Home
        </Link>
        
        <Link to="/about" className="header-button">About</Link>
        <button className="header-button">Contact</button>
        
        {!user ? (
          <Link to="/login" className="header-button">
            Login
          </Link>
        ) : (
          <button onClick={handleLogout} className="header-button logout-button">
            Logout
          </button>
        )}
      </nav>
    </header>
  );
};

export default Header;
