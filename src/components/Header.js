import React from 'react';
import { useNavigate } from 'react-router-dom';

const Header = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await onLogout(); // Call the passed logout function
      navigate('/login'); // Redirect to login page after logout
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header className="flex items-center justify-between p-4 bg-[#000000] shadow-md">
      <div className="flex items-center space-x-3">
        <img src="/path-to-your-logo.png" alt="Trackademia Logo" className="w-10 h-10" />
        <h1 className="text-2xl font-bold text-white">TRACKADEMIA</h1>
      </div>
      
      <nav className="space-x-4">
        {/* Home Button */}
        <button className="shadow-[inset_0_0_0_2px_#616467] text-white px-8 py-3 rounded-full tracking-widest uppercase font-bold bg-transparent hover:bg-[#616467] hover:text-white dark:text-neutral-200 transition duration-200">
          Home
        </button>

        {/* About Button */}
        <button className="shadow-[inset_0_0_0_2px_#616467] text-white px-8 py-3 rounded-full tracking-widest uppercase font-bold bg-transparent hover:bg-[#616467] hover:text-white dark:text-neutral-200 transition duration-200">
          About
        </button>

        {/* Contact Button */}
        <button className="shadow-[inset_0_0_0_2px_#616467] text-white px-8 py-3 rounded-full tracking-widest uppercase font-bold bg-transparent hover:bg-[#616467] hover:text-white dark:text-neutral-200 transition duration-200">
          Contact
        </button>

        {/* Login Button */}
        {!user && (
          <button 
            onClick={() => navigate('/login')} 
            className="shadow-[inset_0_0_0_2px_#616467] text-white px-8 py-3 rounded-full tracking-widest uppercase font-bold bg-transparent hover:bg-[#616467] hover:text-white dark:text-neutral-200 transition duration-200">
            Login
          </button>
        )}

        {/* Conditional Logout Button */}
        {user && (
          <button onClick={handleLogout} className="shadow-[inset_0_0_0_2px_#616467] text-white px-8 py-3 rounded-full tracking-widest uppercase font-bold bg-[#654cf4] hover:bg-transparent hover:text-white dark:text-neutral-200 transition duration-200">
            Logout
          </button>
        )}
      </nav>
    </header>
  );
};

export default Header;
