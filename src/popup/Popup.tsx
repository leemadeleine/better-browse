import React, { useState } from 'react';
import './popup.css';
import Dashboard from './components/Dashboard';

const Popup = () => {
  // State for the active page
  const [activePage, setActivePage] = useState('dashboard');

  // Render the appropriate page based on the active page state
  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="logo" style={{display: 'flex', alignItems: 'center'}}>
          <img src="icon.png" alt="BetterBrowse" style={{width: '40px', height: '40px', marginRight: '16px'}}/>
          <div className="logo-text">BetterBrowse</div>
        </div>
        <nav className="main-nav">
          <button 
            className={`nav-button ${activePage === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActivePage('dashboard')}
          >
            Dashboard
          </button>
        </nav>
      </header>
      
      <main className="app-content">
        {renderPage()}
      </main>
    </div>
  );
};

export default Popup; 