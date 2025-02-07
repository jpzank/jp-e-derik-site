import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Overview from './dashboard/Overview';
import Finance from './dashboard/Finance';
import Autorais from './dashboard/Autorais';
import Marketing from './dashboard/Marketing';
import WebVitals from './dashboard/WebVitals';
import Analytics from './dashboard/Analytics';

const MAX_ATTEMPTS = 5;
const COOLDOWN_TIME = 300000; // 5 minutes in milliseconds

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('overview');

  // Simulated authentication check - in a real app, this would be more robust
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  
  // Rate limiting states
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [lastAttemptTime, setLastAttemptTime] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutTimeRemaining, setLockoutTimeRemaining] = useState(0);

  // Debug log for password check
  useEffect(() => {
    console.log('Expected password:', process.env.REACT_APP_DASHBOARD_PASSWORD);
  }, []);

  // Update countdown timer when locked out
  useEffect(() => {
    let timer;
    if (isLocked) {
      timer = setInterval(() => {
        const timeLeft = (lastAttemptTime + COOLDOWN_TIME) - Date.now();
        if (timeLeft <= 0) {
          setIsLocked(false);
          setLoginAttempts(0);
        } else {
          setLockoutTimeRemaining(Math.ceil(timeLeft / 1000));
        }
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isLocked, lastAttemptTime]);

  const handleLogin = (e) => {
    e.preventDefault();
    
    // Check if account is locked
    if (isLocked) {
      alert(`Account is temporarily locked. Please try again in ${Math.ceil(lockoutTimeRemaining)} seconds.`);
      return;
    }

    // Attempt login
    if (password === process.env.REACT_APP_DASHBOARD_PASSWORD) {
      setIsAuthenticated(true);
      setLoginAttempts(0);
      setIsLocked(false);
    } else {
      const newAttempts = loginAttempts + 1;
      setLoginAttempts(newAttempts);
      setLastAttemptTime(Date.now());
      
      if (newAttempts >= MAX_ATTEMPTS) {
        setIsLocked(true);
        alert(`Too many failed attempts. Please try again in 5 minutes.`);
      } else {
        alert(`Invalid password. ${MAX_ATTEMPTS - newAttempts} attempts remaining.`);
      }
    }
  };

  // Store login attempts in localStorage to persist across page refreshes
  useEffect(() => {
    const storedData = localStorage.getItem('loginData');
    if (storedData) {
      const { attempts, lastAttempt, locked } = JSON.parse(storedData);
      setLoginAttempts(attempts);
      setLastAttemptTime(lastAttempt);
      setIsLocked(locked);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('loginData', JSON.stringify({
      attempts: loginAttempts,
      lastAttempt: lastAttemptTime,
      locked: isLocked
    }));
  }, [loginAttempts, lastAttemptTime, isLocked]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <form onSubmit={handleLogin} className="bg-gray-900 p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl mb-6 font-bold">Dashboard Access</h2>
          {isLocked && (
            <div className="mb-4 p-3 bg-red-900/50 rounded text-red-200 text-sm">
              Account locked. Try again in {Math.ceil(lockoutTimeRemaining)} seconds.
            </div>
          )}
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            className="w-full p-2 mb-4 bg-gray-800 rounded border border-gray-700 text-white"
            disabled={isLocked}
          />
          <button
            type="submit"
            className={`w-full py-2 px-4 rounded transition-colors ${
              isLocked 
                ? 'bg-gray-600 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
            disabled={isLocked}
          >
            Login
          </button>
          {!isLocked && loginAttempts > 0 && (
            <p className="mt-2 text-sm text-yellow-400">
              {MAX_ATTEMPTS - loginAttempts} attempts remaining
            </p>
          )}
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="bg-gray-900 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">JP e Derik Admin</h1>
          <button
            onClick={() => navigate('/')}
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            Back to Site
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-gray-900 rounded-lg p-4">
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => setActiveSection('overview')}
                    className={`w-full text-left px-4 py-2 rounded ${
                      activeSection === 'overview' ? 'bg-blue-600' : 'hover:bg-gray-800'
                    }`}
                  >
                    Overview
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveSection('analytics')}
                    className={`w-full text-left px-4 py-2 rounded ${
                      activeSection === 'analytics' ? 'bg-blue-600' : 'hover:bg-gray-800'
                    }`}
                  >
                    User Analytics
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveSection('finance')}
                    className={`w-full text-left px-4 py-2 rounded ${
                      activeSection === 'finance' ? 'bg-blue-600' : 'hover:bg-gray-800'
                    }`}
                  >
                    Finanças
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveSection('music')}
                    className={`w-full text-left px-4 py-2 rounded ${
                      activeSection === 'music' ? 'bg-blue-600' : 'hover:bg-gray-800'
                    }`}
                  >
                    Autorais
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveSection('marketing')}
                    className={`w-full text-left px-4 py-2 rounded ${
                      activeSection === 'marketing' ? 'bg-blue-600' : 'hover:bg-gray-800'
                    }`}
                  >
                    Marketing
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveSection('webvitals')}
                    className={`w-full text-left px-4 py-2 rounded ${
                      activeSection === 'webvitals' ? 'bg-blue-600' : 'hover:bg-gray-800'
                    }`}
                  >
                    Performance
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Content Area */}
          <div className="md:col-span-3">
            <div className="bg-gray-900 rounded-lg p-6">
              {activeSection === 'overview' && <Overview />}
              {activeSection === 'analytics' && <Analytics />}
              {activeSection === 'finance' && <Finance />}
              {activeSection === 'music' && <Autorais />}
              {activeSection === 'marketing' && <Marketing />}
              {activeSection === 'webvitals' && <WebVitals />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 