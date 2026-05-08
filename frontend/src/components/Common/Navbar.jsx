import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, isDoctor, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 text-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold">
            🏥 Clinic Booking
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-6 items-center">
            {!isAuthenticated ? (
              <>
                <Link to="/login" className="hover:bg-blue-700 px-3 py-2 rounded">
                  Login
                </Link>
                <Link to="/register" className="hover:bg-blue-700 px-3 py-2 rounded">
                  Register
                </Link>
              </>
            ) : (
              <>
                {isDoctor ? (
                  <>
                    <Link to="/admin/dashboard" className="hover:bg-blue-700 px-3 py-2 rounded">
                      Admin Dashboard
                    </Link>
                    <Link to="/admin/appointments" className="hover:bg-blue-700 px-3 py-2 rounded">
                      Appointments
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/dashboard" className="hover:bg-blue-700 px-3 py-2 rounded">
                      Dashboard
                    </Link>
                    <Link to="/book-appointment" className="hover:bg-blue-700 px-3 py-2 rounded">
                      Book Appointment
                    </Link>
                  </>
                )}
                <Link to="/profile" className="hover:bg-blue-700 px-3 py-2 rounded">
                  {user?.name}
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 px-3 py-2 rounded"
                >
                  Logout
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 space-y-2">
            {!isAuthenticated ? (
              <>
                <Link to="/login" className="block hover:bg-blue-700 px-3 py-2 rounded">
                  Login
                </Link>
                <Link to="/register" className="block hover:bg-blue-700 px-3 py-2 rounded">
                  Register
                </Link>
              </>
            ) : (
              <>
                {isDoctor ? (
                  <>
                    <Link to="/admin/dashboard" className="block hover:bg-blue-700 px-3 py-2 rounded">
                      Admin Dashboard
                    </Link>
                    <Link to="/admin/appointments" className="block hover:bg-blue-700 px-3 py-2 rounded">
                      Appointments
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/dashboard" className="block hover:bg-blue-700 px-3 py-2 rounded">
                      Dashboard
                    </Link>
                    <Link to="/book-appointment" className="block hover:bg-blue-700 px-3 py-2 rounded">
                      Book Appointment
                    </Link>
                  </>
                )}
                <Link to="/profile" className="block hover:bg-blue-700 px-3 py-2 rounded">
                  {user?.name}
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left bg-red-600 hover:bg-red-700 px-3 py-2 rounded"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
