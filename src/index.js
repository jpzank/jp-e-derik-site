import ReactDOM from 'react-dom/client';
import './index.css';
import LandingPage from './LandingPage';
import reportWebVitals from './reportWebVitals';
import React, { useState, useRef, useEffect } from 'react';
import Modal from 'react-modal'; // Import React Modal

const root = ReactDOM.createRoot(document.getElementById('root'));
Modal.setAppElement('#root');
root.render(
  <React.StrictMode>
    <LandingPage />
  </React.StrictMode>
);

reportWebVitals();