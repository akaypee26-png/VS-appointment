import React from 'react';
import { Link } from 'react-router-dom';
//import { useAuth } from '../../context/AuthContext';
import { useAuth } from '../context/AuthContext';
//import { Button } from '../Common/index';
import { Button } from '../components/Common';

export const Home = () => {
  const { isAuthenticated, isDoctor } = useAuth();

  return (
    <div className="bg-medical-light min-h-screen text-clinical-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-medical-main to-medical-dark text-white py-24 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Clinic Care — Modern, Trusted Healthcare</h1>
            <p className="text-lg mb-6 opacity-95">Schedule appointments easily, manage patients, and run your clinic with confidence.</p>

            <div className="flex gap-4">
              {!isAuthenticated ? (
                <>
                  <Link to="/login">
                    <Button className="bg-[#0A4173] text-medical-dark hover:bg-gray-100">Login</Button>
                  </Link>
                  <Link to="/register">
                    <Button className="bg-[#0A4173] text-medical-dark hover:bg-gray-100">Get Started</Button>
                  </Link>
                </>
              ) : (
                <Link to={isDoctor ? '/admin/dashboard' : '/dashboard'}>
                  <Button className="bg-medical-light text-medical-dark hover:bg-gray-100">Go to Dashboard</Button>
                </Link>
              )}
            </div>
          </div>

          <div className="bg-[#004B8D] rounded-lg shadow-medical p-8">
            <div className="text-center">
              <div className="text-5xl">⚕</div>
              <h3 className="text-xl font-semibold mt-4">Book with confidence</h3>
              <p className=" mt-2">Transparent scheduling, secure data, and helpful reminders inside the app.</p>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="p-4 border rounded bg-[#0A4173]">
                <div className="font-semibold">30 min slots</div>
                <div className="text-sm ">Balanced schedule for care & reviews</div>
              </div>
              <div className="p-4 border rounded bg-[#0A4173]">
                <div className="font-semibold">Mon-Fri clinic</div>
                <div className="text-sm ">Operational weekdays, best for continuity</div>
              </div>
              <div className="p-4 border rounded bg-[#0A4173]">
                <div className="font-semibold">2hr cancel window</div>
                <div className="text-sm">Protects both clinicians and patients</div>
              </div>
              <div className="p-4 border rounded bg-[#0A4173]">
                <div className="font-semibold">In-app notifications</div>
                <div className="text-sm">Real-time updates inside the patient portal</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Clinics Choose Clinic Care</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Reliable Scheduling', desc: 'Deterministic slot generation to avoid conflicts', icon: '📅' },
              { title: 'Patient Management', desc: 'Patient profiles, history, and contactless updates', icon: '👥' },
              { title: 'Admin Controls', desc: 'Emergency blocks, rescheduling, and reporting', icon: '🛠️' },
              { title: 'Secure Data', desc: 'Password hashing and encrypted tokens', icon: '🔒' },
              { title: 'Responsive UI', desc: 'Mobile-first layout for patients on the go', icon: '📱' },
              { title: 'In-App Notifications', desc: 'Immediate updates without email', icon: '🔔' },
            ].map((f, i) => (
              <div key={i} className="bg-white rounded-lg p-6 shadow-medical">
                <div className="text-3xl mb-3">{f.icon}</div>
                <h3 className="font-semibold mb-2">{f.title}</h3>
                <p className="text-gray-600">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-clinical-800 text-white py-8 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <p>&copy; 2026 Clinic Care. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
