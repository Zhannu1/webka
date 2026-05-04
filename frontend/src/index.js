import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // App.js файлын шақыру
import './App.css';    // Стильдерді қосу

// index.html-дегі 'root' див-ін тауып алу
const root = ReactDOM.createRoot(document.getElementById('root'));

// Қосымшаны экранға шығару
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);