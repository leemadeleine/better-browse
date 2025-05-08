// Background script for BetterBrowse extension

// Mock data storage
interface UserMetrics {
  totalTabsOpened: number;
  totalTabsClosed: number;
  idleTime: number;
  activeTime: number;
  lastActiveDate: string;
  streak: number;
  totalSavedCO2: number;
  dailySavings: Record<string, number>;
}

// Initial metrics
const defaultMetrics: UserMetrics = {
  totalTabsOpened: 0,
  totalTabsClosed: 0,
  idleTime: 0,
  activeTime: 0,
  lastActiveDate: new Date().toISOString().split('T')[0],
  streak: 1,
  totalSavedCO2: 0,
  dailySavings: {}
};

// Initialize data
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ metrics: defaultMetrics });
  console.log('BetterBrowse extension installed');
});

// Track tab activity
chrome.tabs.onCreated.addListener(() => {
  updateMetric('totalTabsOpened', 1);
});

chrome.tabs.onRemoved.addListener(() => {
  updateMetric('totalTabsClosed', 1);
  // Simulate CO2 saving for closing a tab
  saveCO2(0.5);
});

// Track user idle state
chrome.idle.setDetectionInterval(60); // Set idle detection to 60 seconds
chrome.idle.onStateChanged.addListener((state) => {
  const now = Date.now();
  
  if (state === 'idle' || state === 'locked') {
    // Store start of idle time
    chrome.storage.local.set({ idleStartTime: now });
  } else if (state === 'active') {
    // Calculate idle time
    chrome.storage.local.get(['idleStartTime'], (data) => {
      if (data.idleStartTime) {
        const idleTimeMinutes = (now - data.idleStartTime) / (1000 * 60);
        updateMetric('idleTime', idleTimeMinutes);
      }
    });
  }
});

// Check streak every day
const checkDailyStreak = () => {
  const today = new Date().toISOString().split('T')[0];
  
  chrome.storage.local.get(['metrics'], (data) => {
    const metrics = data.metrics as UserMetrics || defaultMetrics;
    
    if (metrics.lastActiveDate !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      
      if (metrics.lastActiveDate === yesterdayStr) {
        // Streak continues
        metrics.streak += 1;
      } else {
        // Streak broken
        metrics.streak = 1;
      }
      
      metrics.lastActiveDate = today;
      chrome.storage.local.set({ metrics });
    }
  });
};

// Daily check for streak
setInterval(checkDailyStreak, 1000 * 60 * 60); // Check every hour
checkDailyStreak(); // Check on startup

// Helper function to update metrics
function updateMetric(key: keyof UserMetrics, value: number) {
  chrome.storage.local.get(['metrics'], (data) => {
    const metrics = data.metrics as UserMetrics || defaultMetrics;
    
    if (typeof metrics[key] === 'number') {
      (metrics[key] as number) += value;
      chrome.storage.local.set({ metrics });
    }
  });
}

// Helper function to save CO2
function saveCO2(amount: number) {
  chrome.storage.local.get(['metrics'], (data) => {
    const metrics = data.metrics as UserMetrics || defaultMetrics;
    const today = new Date().toISOString().split('T')[0];
    
    metrics.totalSavedCO2 += amount;
    
    if (!metrics.dailySavings[today]) {
      metrics.dailySavings[today] = 0;
    }
    metrics.dailySavings[today] += amount;
    
    chrome.storage.local.set({ metrics });
  });
} 