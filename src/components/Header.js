import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';
import logo from '../assets/logo.png';

const Header = ({ user, onLogout }) => {
  const [showAlert, setShowAlert] = useState(false); // State to control alert visibility
  const navigate = useNavigate();

  // Handle logout button click
  const handleLogoutClick = () => {
    setShowAlert(true); // Show the logout confirmation alert
  };

  // Handle confirmation of logout
  const handleLogout = async () => {
    try {
      await onLogout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Handle canceling the logout
  const handleCancel = () => {
    setShowAlert(false); // Hide the alert
  };

  return (
    <header className="header-container">
      <div className="header-logo">
        <img src={logo} alt="Trackademia Logo" className="logo-image" />
        <h1 className="header-title">TRACKADEMIA</h1>
      </div>

      <nav className="header-nav">
        {/* Use Link for Home Button to avoid page refresh */}
        <Link to="/home" className="header-button">
          Home
        </Link>

        <Link to="/about" className="header-button">About</Link>


        {!user ? (
          <Link to="/login" className="header-button">
            Login
          </Link>
        ) : (
          <button onClick={handleLogoutClick} className="header-button logout-button">
            Logout
          </button>
        )}
      </nav>

      {/* Logout confirmation alert */}
      {showAlert && (
        <div className="logout-alert">
          <div className="alert-content">
            <p className="alert-message">Are you sure you want to logout?</p>
            <div className="alert-buttons">
              <button
                onClick={handleLogout}
                className="alert-button confirm-button"
              >
                Yes, Logout
              </button>
              <button
                onClick={handleCancel}
                className="alert-button cancel-button"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
