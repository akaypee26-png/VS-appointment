import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout, isDoctor } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  return (
    <nav className="bg-gradient-to-r from-medical-light to-medical-dark text-white shadow-medical-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center font-bold text-medical-main">
              ⚕
            </div>
            <div className="font-bold text-lg  text-medical-main">Clinic Care</div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {isAuthenticated ? (
              <>
                {isDoctor ? (
                  <>
                    <Link to="/admin/dashboard" className="hover:text-medical-light transition font-medium">
                      Dashboard
                    </Link>
                    <Link to="/admin/appointments" className="hover:text-medical-light transition font-medium">
                      Appointments
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/dashboard" className="hover:text-medical-light transition font-medium">
                      Dashboard
                    </Link>
                    <Link to="/book-appointment" className="hover:text-medical-light transition font-medium">
                      Book Appointment
                    </Link>
                  </>
                )}
                <div className="flex items-center gap-4 border-l border-medical-light/30 pl-8">
                  <span className="text-sm">Welcome, {user?.name || 'User'}</span>
                  <Link to="/profile" className="hover:text-medical-light transition font-medium">
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="bg-medical-light text-medical-main px-4 py-2 rounded-medical font-semibold hover:bg-white transition"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex gap-4">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-medical font-semibold hover:bg-medical-light/20 transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-white text-medical-main px-4 py-2 rounded-medical font-semibold hover:bg-medical-light transition"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white text-2xl hover:opacity-80 transition"
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-3 border-t border-medical-light/30 pt-4">
            {isAuthenticated ? (
              <>
                {isDoctor ? (
                  <>
                    <Link to="/admin/dashboard" onClick={() => setMobileMenuOpen(false)} className="block hover:opacity-80 transition py-2">
                      Dashboard
                    </Link>
                    <Link to="/admin/appointments" onClick={() => setMobileMenuOpen(false)} className="block hover:opacity-80 transition py-2">
                      Appointments
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="block hover:opacity-80 transition py-2">
                      Dashboard
                    </Link>
                    <Link to="/book-appointment" onClick={() => setMobileMenuOpen(false)} className="block hover:opacity-80 transition py-2">
                      Book Appointment
                    </Link>
                  </>
                )}
                <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="block hover:opacity-80 transition py-2">
                  Profile
                </Link>
                <button onClick={handleLogout} className="w-full bg-medical-light text-medical-main px-4 py-2 rounded-medical font-semibold hover:bg-white transition">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="block hover:opacity-80 transition py-2">
                  Login
                </Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="block bg-white text-medical-main px-4 py-2 rounded-medical font-semibold hover:bg-medical-light transition py-2">
                  Register
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
