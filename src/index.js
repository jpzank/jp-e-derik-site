import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import LandingPage from './LandingPage';
import Dashboard from './Dashboard';
import React from 'react';
import Modal from 'react-modal'; // Import React Modal
import reportWebVitals from './reportWebVitals';
import ReactGA from 'react-ga4';

// Initialize Google Analytics
ReactGA.initialize('G-XXXXXXXXXX'); // Replace with your GA4 measurement ID

const root = ReactDOM.createRoot(document.getElementById('root'));
Modal.setAppElement('#root');

root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/admin" element={<Dashboard />} />
      </Routes>
    </Router>
  </React.StrictMode>
);

// Track web vitals
reportWebVitals(metric => {
  ReactGA.event({
    category: 'Web Vitals',
    action: metric.name,
    value: Math.round(metric.value),
    label: metric.id,
    nonInteraction: true,
  });
});