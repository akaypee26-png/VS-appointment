import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../Common/index';

export const Home = () => {
  const { isAuthenticated, isDoctor } = useAuth();

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Professional Clinic Appointment Booking</h1>
          <p className="text-xl mb-8 opacity-90">
            Easy, fast, and secure appointment scheduling for modern healthcare
          </p>
          <div className="flex justify-center space-x-4">
            {!isAuthenticated ? (
              <>
                <Link to="/login">
                  <Button className="bg-white text-blue-600 hover:bg-gray-100">Login</Button>
                </Link>
                <Link to="/register">
                  <Button className="bg-yellow-500 text-blue-600 hover:bg-yellow-400">Get Started</Button>
                </Link>
              </>
            ) : (
              <Link to={isDoctor ? '/admin/dashboard' : '/dashboard'}>
                <Button className="bg-white text-blue-600 hover:bg-gray-100">
                  Go to Dashboard
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Instant Booking',
                description: 'Book appointments instantly with real-time slot availability',
                icon: '⚡',
              },
              {
                title: 'Secure & Safe',
                description: 'Your data is protected with enterprise-grade security',
                icon: '🔒',
              },
              {
                title: 'Flexible',
                description: 'Reschedule or cancel appointments anytime with ease',
                icon: '📱',
              },
              {
                title: 'Notifications',
                description: 'Get instant email notifications for all your appointments',
                icon: '📧',
              },
              {
                title: 'Professional',
                description: 'Run your clinic like a pro with our admin dashboard',
                icon: '👨‍⚕️',
              },
              {
                title: 'Easy to Use',
                description: 'Intuitive interface that anyone can use without training',
                icon: '✨',
              },
            ].map((feature, idx) => (
              <div key={idx} className="bg-blue-50 rounded-lg p-6 text-center">
                <div className="text-4xl mb-3">{feature.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="bg-gray-50 py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold mb-4">Clinic Information</h3>
              <p className="text-gray-600 mb-4">
                Our clinic is dedicated to providing professional healthcare services with modern technology.
              </p>
              <div className="space-y-4">
                <div>
                  <p className="font-semibold">📍 Address</p>
                  <p className="text-gray-600">123 Medical Center, Your City</p>
                </div>
                <div>
                  <p className="font-semibold">📞 Phone</p>
                  <p className="text-gray-600">+1 (555) 123-4567</p>
                </div>
                <div>
                  <p className="font-semibold">🕐 Clinic Hours</p>
                  <p className="text-gray-600">Monday - Friday</p>
                  <p className="text-gray-600">10:00 AM - 5:00 PM IST</p>
                  <p className="text-gray-600">(Lunch: 1:00 PM - 2:00 PM)</p>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-4">Quick Facts</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-center">
                  <span className="text-blue-600 mr-3">✓</span>
                  30-minute appointment slots
                </li>
                <li className="flex items-center">
                  <span className="text-blue-600 mr-3">✓</span>
                  Book up to 30 days in advance
                </li>
                <li className="flex items-center">
                  <span className="text-blue-600 mr-3">✓</span>
                  Cancel up to 2 hours before
                </li>
                <li className="flex items-center">
                  <span className="text-blue-600 mr-3">✓</span>
                  Instant email confirmations
                </li>
                <li className="flex items-center">
                  <span className="text-blue-600 mr-3">✓</span>
                  Professional support
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <p>&copy; 2026 Clinic Booking System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
