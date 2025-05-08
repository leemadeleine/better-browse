import React from 'react';
import { createRoot } from 'react-dom/client';
import Popup from './Popup';
import './popup.css';

// Modern React 18 rendering
const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<Popup />);
} 