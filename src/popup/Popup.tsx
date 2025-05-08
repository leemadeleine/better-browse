import React, { useState, useEffect } from 'react';
import './popup.css';
import EnergyTracker from './services/EnergyTracker';
import WeeklyChart from './components/WeeklyChart';

const Popup = () => {
  // Tabs state
  const [activeTab, setActiveTab] = useState('today');
  
  // Energy metrics state
  const [energyUsage, setEnergyUsage] = useState(0);
  const [co2Equivalent, setCo2Equivalent] = useState(0);
  const [openTabs, setOpenTabs] = useState(0);
  const [streak, setStreak] = useState(1);
  const [totalSaved, setTotalSaved] = useState(0);
  
  // Loading state
  const [isLoading, setIsLoading] = useState(true);
  
  // Weekly chart data
  const [weeklyData, setWeeklyData] = useState<{ dates: string[], savings: number[] }>({
    dates: [],
    savings: []
  });
  
  // Mock tips and actions
  const ecoTips = [
    { tip: "Close unused tabs to save energy", action: "Close 5 tabs", impact: 15 },
    { tip: "Reduce idle browser time", action: "Set 10min idle timeout", impact: 20 },
    { tip: "Clear your email inbox", action: "Delete old emails", impact: 10 },
    { tip: "Use dark mode to save energy", action: "Switch to dark mode", impact: 5 },
  ];
  
  const [currentTip, setCurrentTip] = useState(ecoTips[0]);
  
  // Load data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Get initial data
        await updateMetrics();
        
        // Get weekly summary data
        const summary = await EnergyTracker.getWeeklySummary();
        setWeeklyData(summary);
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading data:', error);
        setIsLoading(false);
      }
    };
    
    fetchData();
    
    // Change tip every 5 seconds
    const tipInterval = setInterval(() => {
      const randomTip = ecoTips[Math.floor(Math.random() * ecoTips.length)];
      setCurrentTip(randomTip);
    }, 5000);
    
    return () => clearInterval(tipInterval);
  }, []);
  
  // Update all metrics from the tracker service
  const updateMetrics = async () => {
    try {
      const stats = await EnergyTracker.getBrowsingStats();
      const metrics = await EnergyTracker.calculateCurrentMetrics();
      
      setOpenTabs(stats.openTabs);
      setEnergyUsage(metrics.energyUsage);
      setCo2Equivalent(metrics.co2Equivalent);
      setStreak(metrics.streak);
      setTotalSaved(metrics.totalSaved);
    } catch (error) {
      console.error('Error updating metrics:', error);
    }
  };
  
  // Handle eco-action
  const handleAction = async () => {
    try {
      // Update metrics based on the action taken
      const updatedMetrics = await EnergyTracker.actionTaken(currentTip.impact);
      
      setCo2Equivalent(updatedMetrics.co2Equivalent);
      setTotalSaved(updatedMetrics.totalSaved);
      setStreak(updatedMetrics.streak);
      
      // Get updated weekly summary
      const summary = await EnergyTracker.getWeeklySummary();
      setWeeklyData(summary);
      
      // Show success message
      alert(`Great job! You just saved ${currentTip.impact}g of CO₂ equivalent emissions!`);
    } catch (error) {
      console.error('Error taking action:', error);
      alert('There was an error processing your action. Please try again.');
    }
  };
  
  // Loading indicator
  if (isLoading) {
    return (
      <div className="container loading-container">
        <h1>BetterBrowse</h1>
        <p>Your eco-conscious assistant</p>
        <div className="loading-spinner"></div>
        <p>Loading your eco data...</p>
      </div>
    );
  }
  
  return (
    <div className="container">
      <h1>BetterBrowse</h1>
      <p>Your eco-conscious assistant</p>
      
      <div className="tabs-nav">
        <button 
          className={`tab-button ${activeTab === 'today' ? 'active' : ''}`}
          onClick={() => setActiveTab('today')}
        >
          Today
        </button>
        <button 
          className={`tab-button ${activeTab === 'weekly' ? 'active' : ''}`}
          onClick={() => setActiveTab('weekly')}
        >
          Weekly
        </button>
      </div>
      
      {activeTab === 'today' ? (
        <>
          <div className="stats-container">
            <div className="stat-item">
              <span className="stat-value">{energyUsage.toFixed(1)}</span>
              <span className="stat-label">kWh</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{co2Equivalent.toFixed(1)}</span>
              <span className="stat-label">g CO₂</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{openTabs}</span>
              <span className="stat-label">open tabs</span>
            </div>
          </div>
          
          <div className="streak-container">
            <div className="streak-badge">🔥 {streak} day streak</div>
            <div className="total-saved">Total saved: {totalSaved.toFixed(1)}g CO₂</div>
          </div>
          
          <div className="tip-container">
            <div className="tip-text">{currentTip.tip}</div>
            <button onClick={handleAction} className="action-button">
              {currentTip.action} (-{currentTip.impact}g CO₂)
            </button>
          </div>
        </>
      ) : (
        <WeeklyChart dates={weeklyData.dates} savings={weeklyData.savings} />
      )}
    </div>
  );
};

export default Popup; 