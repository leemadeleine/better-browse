import React, { useState } from 'react';
import { Box } from '@mui/material';
import SustainabilityTip from './SustainabilityTip';
import PowerIcon from '@mui/icons-material/Power';
import DevicesIcon from '@mui/icons-material/Devices';
import TabIcon from '@mui/icons-material/Tab';

// Define tip data structure
interface Tip {
  id: string;
  title: string;
  message: string;
  learnMoreLink?: string;
  icon?: React.ReactNode;
}

// Static mock tips for the UI display
const mockTips: Tip[] = [
  {
    id: 'tab-tip',
    title: 'Consider closing some tabs',
    message: 'You have more than 15 tabs open. Closing tabs reduces memory usage and server load.',
    learnMoreLink: 'https://greenspector.com/en/what-is-the-environmental-impact-of-opening-or-not-opening-links-in-another-tab/',
    icon: <TabIcon sx={{ color: '#4B985A' }} />,
  },
  {
    id: 'screen-brightness',
    title: 'Sustainability Tip',
    message: 'Reducing screen brightness by 20% can save up to 20% of your monitor energy consumption.',
    learnMoreLink: 'https://sustainability.google/progress/energy/efficiency-tips/',
    icon: <PowerIcon sx={{ color: '#4B985A' }} />,
  }
];

const TipsContainer: React.FC = () => {
  // State to track visible tips - initially show the first two
  const [visibleTips, setVisibleTips] = useState<Tip[]>(mockTips);
  
  // Function to close a tip
  const handleCloseTip = (tipId: string) => {
    setVisibleTips(prev => prev.filter(tip => tip.id !== tipId));
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