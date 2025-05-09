// Background script for BetterBrowse extension

// Check if running in a Chrome extension context
const isChromeExtension = typeof chrome !== 'undefined' && chrome.storage && chrome.tabs;

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
  currentOpenTabs: number;
}

// Define the structure for sustainability tips
interface SustainabilityTip {
  id: string;
  title: string;
  message: string;
  learnMoreLink?: string;
  condition: (metrics: UserMetrics) => boolean;
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
  dailySavings: {},
  currentOpenTabs: 0
};

// Store tips to show to the user - this is the single source of truth for tips
const sustainabilityTips: SustainabilityTip[] = [
  {
    id: 'tab-tip',
    title: 'Consider closing some tabs',
    message: 'You have more than 15 tabs open. Closing tabs reduces memory usage and server load.',
    learnMoreLink: 'https://greenspector.com/en/what-is-the-environmental-impact-of-opening-or-not-opening-links-in-another-tab/',
    condition: (metrics: UserMetrics) => metrics.currentOpenTabs > 15
  },
  {
    id: 'screen-brightness',
    title: 'Sustainability Tip',
    message: 'Reducing screen brightness by 20% can save up to 20% of your monitor energy consumption.',
    learnMoreLink: 'https://sustainability.google/progress/energy/efficiency-tips/',
    condition: (metrics: UserMetrics) => true // Always valid
  },
  {
    id: 'outlook-email',
    title: 'Clean up your Outlook inbox',
    message: 'Large email archives consume server energy. Use Outlook\'s Cleanup tool to reduce redundant messages and free up storage.',
    learnMoreLink: 'https://support.microsoft.com/en-us/office/use-the-conversation-clean-up-tool-to-delete-redundant-messages-70373cdd-acc4-4600-bc10-35c21cdb0503',
    condition: (metrics: UserMetrics) => true // Always valid
  }
];

// Function to update the extension badge with number of tips
function updateBadge(count: number) {
  if (!isChromeExtension) return;
  
  if (count > 0) {
    // Set badge background color (green)
    chrome.action.setBadgeBackgroundColor({ color: '#4B985A' });
    // Set badge text to the count
    chrome.action.setBadgeText({ text: count.toString() });
  } else {
    // Clear the badge when no tips
    chrome.action.setBadgeText({ text: '' });
  }
}

// Initialize Chrome extension event listeners
function initializeExtension() {
  if (!isChromeExtension) {
    console.warn('Chrome APIs not available - running in development mode or outside extension context');
    return;
  }

  // Initialize data
  chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({ metrics: defaultMetrics });
    
    // Store all tips in storage for the UI to use as reference
    chrome.storage.local.set({ allTips: sustainabilityTips });
    
    console.log('BetterBrowse extension installed');
    
    // Initialize with some tips
    checkAndStoreTips(defaultMetrics);
  });

  // Track tab activity
  chrome.tabs.onCreated.addListener(() => {
    updateMetric('totalTabsOpened', 1);
    updateTabCount();
  });

  chrome.tabs.onRemoved.addListener(() => {
    updateMetric('totalTabsClosed', 1);
    updateTabCount();
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
          
          // Check for tips based on idle time
          chrome.storage.local.get(['metrics'], (metricsData) => {
            const metrics = metricsData.metrics as UserMetrics || defaultMetrics;
            checkAndStoreTips(metrics);
          });
        }
      });
    }
  });

  // Daily check for streak
  setInterval(checkDailyStreak, 1000 * 60 * 60); // Check every hour
  checkDailyStreak(); // Check on startup

  // Initial tab count check when extension loads
  setTimeout(() => {
    updateTabCount();
  }, 1000);
}

// Function to update the current tab count
function updateTabCount() {
  if (!isChromeExtension) return;
  
  chrome.tabs.query({}, (tabs) => {
    const tabCount = tabs.length;
    
    chrome.storage.local.get(['metrics'], (data) => {
      const metrics = data.metrics as UserMetrics || defaultMetrics;
      metrics.currentOpenTabs = tabCount;
      chrome.storage.local.set({ metrics });
      
      // Check if we should show any tips based on tab count
      checkAndStoreTips(metrics);
    });
  });
}

// Function to check conditions and store tips to show
function checkAndStoreTips(metrics: UserMetrics) {
  if (!isChromeExtension) return;
  
  chrome.storage.local.get(['dismissedTips'], (data) => {
    const dismissedTips = data.dismissedTips || [];
    
    // Filter tips that meet their conditions and haven't been dismissed
    const tipsToShow = sustainabilityTips.filter(tip => 
      tip.condition(metrics) && !dismissedTips.includes(tip.id)
    );
    
    // Update the badge with the number of tips
    updateBadge(tipsToShow.length);
    
    if (tipsToShow.length > 0) {
      // Store tips to show in the popup
      chrome.storage.local.set({ 
        tipsToShow: tipsToShow.map(({ id, title, message, learnMoreLink }) => ({ 
          id, 
          title, 
          message,
          learnMoreLink 
        }))
      });
    }
  });
}

// Check streak every day
const checkDailyStreak = () => {
  if (!isChromeExtension) return;
  
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

// Helper function to update metrics
function updateMetric(key: keyof UserMetrics, value: number) {
  if (!isChromeExtension) return;
  
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
  if (!isChromeExtension) return;
  
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

// Initialize the extension if Chrome APIs are available
initializeExtension(); 