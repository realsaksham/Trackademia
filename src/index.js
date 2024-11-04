// index.js
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App'; // Adjust the path as needed
import { BrowserRouter } from 'react-router-dom';
import './index.css';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
