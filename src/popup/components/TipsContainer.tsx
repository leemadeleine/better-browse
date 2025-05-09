import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import SustainabilityTip from './SustainabilityTip';
import PowerIcon from '@mui/icons-material/Power';
import DevicesIcon from '@mui/icons-material/Devices';
import TabIcon from '@mui/icons-material/Tab';
import EmailIcon from '@mui/icons-material/Email';

// Define tip data structure
interface Tip {
  id: string;
  title: string;
  message: string;
  learnMoreLink?: string;
  icon?: React.ReactNode;
}

// Safe check for Chrome extension environment
const isChromeExtension = () => {
  try {
    return typeof chrome !== 'undefined' && 
           chrome.action && 
           typeof chrome.action.setBadgeText === 'function';
  } catch (err) {
    console.warn('Chrome badge API not available');
    return false;
  }
};

// Static mock tips for the UI display
const mockTips: Tip[] = [
  {
    id: 'outlook-email',
    title: 'Clean up your inbox',
    message: 'Large email archives consume server energy. Use Gmail\'s Cleanup tool to reduce redundant messages and free up storage.',
    learnMoreLink: 'https://support.google.com/a/users/answer/14300711?hl=en',
    icon: <EmailIcon sx={{ color: '#4B985A' }} />,
  },
  {
    id: 'tab-tip',
    title: 'Consider closing some tabs',
    message: 'You have more than 10 tabs open. Closing tabs reduces memory usage and server load.',
    learnMoreLink: 'https://greenspector.com/en/what-is-the-environmental-impact-of-opening-or-not-opening-links-in-another-tab/',
    icon: <TabIcon sx={{ color: '#4B985A' }} />,
  },
  {
    id: 'screen-brightness',
    title: 'Sustainability Tip',
    message: 'Reducing screen brightness by 20% can save up to 20% of your monitor energy consumption.',
    learnMoreLink: 'https://blog.mozilla.org/en/internet-culture/deep-dives/digital-carbon-footprint/',
    icon: <PowerIcon sx={{ color: '#4B985A' }} />,
  },
];

// Function to update the badge count
const updateBadgeCount = (count: number) => {
  if (!isChromeExtension()) return;
  
  if (count > 0) {
    chrome.action.setBadgeBackgroundColor({ color: '#4B985A' });
    chrome.action.setBadgeText({ text: count.toString() });
  } else {
    chrome.action.setBadgeText({ text: '' });
  }
};

const TipsContainer: React.FC = () => {
  // State to track visible tips - initially show all mock tips
  const [visibleTips, setVisibleTips] = useState<Tip[]>(mockTips);
  
  // Update badge on initial render and when visible tips change
  useEffect(() => {
    updateBadgeCount(visibleTips.length);
  }, [visibleTips.length]);
  
  // Function to close a tip
  const handleCloseTip = (tipId: string) => {
    setVisibleTips(prev => {
      const updatedTips = prev.filter(tip => tip.id !== tipId);
      
      // Store dismissed tip in Chrome storage if available
      if (isChromeExtension()) {
        try {
          chrome.storage.local.get(['dismissedTips'], (result) => {
            const dismissedTips = result.dismissedTips || [];
            if (!dismissedTips.includes(tipId)) {
              dismissedTips.push(tipId);
              chrome.storage.local.set({ dismissedTips });
            }
            
            // Update tipsToShow in storage
            chrome.storage.local.get(['tipsToShow'], (tipsResult) => {
              const tipsToShow = tipsResult.tipsToShow || [];
              const updatedStorageTips = tipsToShow.filter((tip: any) => tip.id !== tipId);
              chrome.storage.local.set({ tipsToShow: updatedStorageTips });
            });
          });
        } catch (error) {
          console.error('Error storing dismissed tip:', error);
        }
      }
      
      return updatedTips;
    });
  };
  
  // If no tips to show, return null
  if (visibleTips.length === 0) {
    return null;
  }
  
  return (
    <Box sx={{ width: '100%', mb: 3 }}>
      {visibleTips.map(tip => (
        <SustainabilityTip
          key={tip.id}
          title={tip.title}
          message={tip.message}
          learnMoreLink={tip.learnMoreLink}
          icon={tip.icon}
          onClose={() => handleCloseTip(tip.id)}
        />
      ))}
    </Box>
  );
};

export default TipsContainer; 