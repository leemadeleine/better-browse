import React, { useState, useEffect } from 'react';
import EnergyTracker from '../services/EnergyTracker';
import { makeStyles } from '@mui/styles';
import { 
  Typography, 
  Box, 
  Paper, 
  Button, 
  Divider,
  Tab,
  Tabs,
  Card,
  CardContent,
  ThemeProvider,
  createTheme
} from '@mui/material';

// Create a theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#492D97',
      light: '#8566CA',
      dark: '#36227A',
    },
    secondary: {
      main: '#76C893',
      light: '#B6F7CD',
      dark: '#0B7A58',
    },
    background: {
      default: '#F8F9FA',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#323338',
      secondary: '#666666',
    },
  },
  typography: {
    fontFamily: '"Nunito", "Quicksand", "Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
    h5: {
      fontFamily: '"Poppins", "Quicksand", sans-serif',
      fontWeight: 600,
    },
    h6: {
      fontFamily: '"Poppins", "Quicksand", sans-serif',
      fontWeight: 600,
    },
    subtitle1: {
      fontFamily: '"Quicksand", "Poppins", sans-serif',
      fontWeight: 600,
    },
    subtitle2: {
      fontFamily: '"Quicksand", "Poppins", sans-serif',
    },
    button: {
      fontFamily: '"Nunito", "Quicksand", sans-serif',
      textTransform: 'none',
      fontWeight: 600,
    },
  },
});

// Styles using makeStyles
const useStyles = makeStyles(() => ({
  dashboard: {
    // width: '100%',
    maxWidth: 800,
    margin: '0 auto',
    padding: 20,
  },
  section: {
    marginBottom: 30,
    borderRadius: 8,
    padding: 20,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
    backgroundColor: '#FFFFFF',
    border: '1px solid #36227A',
  },
  sectionTitle: {
    color: '#323338',
    fontSize: '1.2rem',
    marginTop: 0,
    marginBottom: 15,
    fontWeight: 600,
    borderBottom: '1px solid #f0f0f0',
    paddingBottom: 10,
  },
  chartsRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 20,
  },
  chartHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  chartTitle: {
    margin: 0,
    color: '#492D97',
    fontWeight: 600,
    fontFamily: '"Poppins", "Quicksand", sans-serif',
    fontSize: '1.1rem',
    letterSpacing: '0.5px',
  },
  tabSelector: {
    borderRadius: 6,
    overflow: 'hidden',
    backgroundColor: '#F5F6F8',
    border: '1px solid #E5E7EB',
  },
  tabButton: {
    backgroundColor: 'transparent',
    border: 'none',
    padding: '6px 12px',
    cursor: 'pointer',
    fontSize: '0.8rem',
    color: '#666666',
    transition: 'all 0.2s ease',
    fontFamily: '"Nunito", sans-serif',
    fontWeight: 600,
    '&.active': {
      backgroundColor: '#492D97',
      color: 'white',
      fontWeight: 700,
    },
    '&:hover:not(.active)': {
      backgroundColor: '#F5F6F8',
    },
  },
  barChart: {
    flex: 1,
    minWidth: 200,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  chartBars: {
    display: 'flex',
    alignItems: 'flex-end',
    height: 150,
    width: '100%',
    marginBottom: 10,
  },
  barContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    height: '100%',
    justifyContent: 'end'
  },
  bar: {
    width: '70%',
    transition: 'height 0.5s ease',
    borderRadius: '3px 3px 0 0',
  },
  barValue: {
    fontSize: '0.7rem',
    color: '#666666',
    marginBottom: 5,
  },
  barLabel: {
    fontSize: '0.7rem',
    color: '#666666',
    marginTop: 5,
  },
  unitLabel: {
    fontSize: '0.8rem',
    color: '#666666',
  },
  topSites: {
    flex: 1,
    minWidth: 160,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  doughnutChart: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  chartLegend: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: 10,
    width: '100%',
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: 5,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 2,
    marginRight: 6,
  },
  legendLabel: {
    fontSize: '0.8rem',
    color: '#666666',
  },
  progressItems: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 20,
    justifyContent: 'space-between',
  },
  progressItem: {
    flex: 1,
    minWidth: 150,
    backgroundColor: '#F5F6F8',
    borderRadius: 8,
    padding: 15,
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  progressIcon: {
    fontSize: '2rem !important',
    marginBottom: 10,
    color: '#76C893',
  },
  progressValue: {
    fontSize: '2.5rem !important',
    fontWeight: '900 !important',
    color: '#323338',
    marginBottom: 5,
    fontFamily: '"Quicksand", sans-serif',
  },
  progressDescription: {
    fontSize: '0.8rem',
    color: '#666666',
    lineHeight: 1.4,
    fontFamily: '"Nunito", sans-serif',
  },
  tipsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  tipItem: {
    display: 'flex',
    backgroundColor: '#F5F6F8',
    borderRadius: 6,
    padding: 12,
  },
  tipIcon: {
    marginRight: 10,
    fontSize: '1.2rem',
  },
  tipText: {
    fontSize: '0.9rem',
    color: '#323338',
    lineHeight: 1.4,
    fontFamily: '"Nunito", sans-serif',
    fontWeight: 500,
  },
}));

// Doughnut chart component for top energy using sites
const DoughnutChart: React.FC<{ data: { label: string; value: number; color: string }[] }> = ({ data }) => {
  const classes = useStyles();
  // Calculate the total for percentages
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  // Calculate the circumference of the circle
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  
  let currentOffset = 0;
  
  return (
    <div className={classes.doughnutChart}>
      <svg width="120" height="120" viewBox="0 0 120 120">
        {data.map((item, index) => {
          // Calculate the percentage and the stroke-dasharray
          const percentage = item.value / total;
          const dashArray = percentage * circumference;
          
          // Create the circle segment
          const segment = (
            <circle
              key={index}
              cx="60"
              cy="60"
              r={radius}
              fill="transparent"
              stroke={item.color}
              strokeWidth="15"
              strokeDasharray={`${dashArray} ${circumference - dashArray}`}
              strokeDashoffset={-currentOffset}
              transform="rotate(-90 60 60)"
            />
          );
          
          // Update the offset for the next segment
          currentOffset += dashArray;
          
          return segment;
        })}
        <circle cx="60" cy="60" r="42" fill="white" />
      </svg>
      
      <div className={classes.chartLegend}>
        {data.map((item, index) => (
          <div key={index} className={classes.legendItem}>
            <span className={classes.legendColor} style={{ backgroundColor: item.color }}></span>
            <span className={classes.legendLabel}>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Bar chart component for energy usage and CO2 emissions
const BarChart: React.FC<{
  dates: string[];
  values: number[];
  title: string;
  unit: string;
  color: string;
}> = ({ dates, values, title, unit, color }) => {
  const classes = useStyles();
  // Find max value for scaling
  const maxValue = Math.max(...values);
  
  return (
    <div className={classes.barChart}>
      <Typography variant="subtitle2" sx={{ color: '#666666', mb: 1, textAlign: 'center' }}>{title}</Typography>
      <div className={classes.chartBars}>
        {dates.map((date, index) => (
          <div key={index} className={classes.barContainer}>
            {/* <div className={classes.barValue}>{values[index]}</div> */}
            <div 
              className={classes.bar} 
              style={{ 
                height: `${(values[index] / maxValue) * 100}%`, 
                backgroundColor: color,
              }}
            ></div>
            <div className={classes.barLabel}>{date}</div>
          </div>
        ))}
      </div>
      <div className={classes.unitLabel}>{unit}</div>
    </div>
  );
};

// Tab selection component
const TabSelector: React.FC<{
  activeTab: 'This Week' | 'This Month' | 'All Time';
  onChange: (tab: 'This Week' | 'This Month' | 'All Time') => void;
}> = ({ activeTab, onChange }) => {
  const classes = useStyles();
  const tabs: ('This Week' | 'This Month' | 'All Time')[] = ['This Week', 'This Month', 'All Time'];
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    onChange(tabs[newValue]);
  };
  
  return (
    <Tabs
      value={tabs.indexOf(activeTab)}
      onChange={handleChange}
      variant="standard"
      indicatorColor="primary"
      textColor="primary"
      sx={{ minHeight: '32px' }}
    >
      {tabs.map((tab) => (
        <Tab 
          key={tab} 
          label={tab} 
          sx={{ 
            minHeight: '32px', 
            fontSize: '0.8rem',
            padding: '6px 12px',
          }}
        />
      ))}
    </Tabs>
  );
};

// Progress item component
const ProgressItem: React.FC<{
  icon: string;
  value: number;
  description: string;
}> = ({ icon, value, description }) => {
  const classes = useStyles();
  return (
    <Card className={classes.progressItem} variant="outlined">
      <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
        <Typography className={classes.progressIcon}>{icon}</Typography>
        <Typography className={classes.progressValue}>{value}</Typography>
        <Typography className={classes.progressDescription}>{description}</Typography>
      </CardContent>
    </Card>
  );
};

// Main Dashboard component
const Dashboard: React.FC = () => {
  const classes = useStyles();
  
  type TimeRange = 'This Week' | 'This Month' | 'All Time';
  
  // State for tab selection
  const [timeRange, setTimeRange] = useState<TimeRange>('This Week');
  
  // Different mock data sets for different time ranges
  const mockData: Record<TimeRange, {
    dates: string[];
    energyValues: number[];
    co2Values: number[];
    topSites: Array<{ label: string; value: number; color: string }>;
  }> = {
    'This Week': {
      dates: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      energyValues: [40, 60, 55, 45, 50, 65, 45],
      co2Values: [80, 100, 90, 70, 90, 100, 80],
      topSites: [
        { label: 'YouTube', value: 45, color: '#FF0000' },
        { label: 'Google', value: 35, color: '#4285F4' },
        { label: 'GitHub', value: 20, color: '#6E5494' }
      ]
    },
    'This Month': {
      dates: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      energyValues: [250, 180, 220, 275],
      co2Values: [420, 380, 400, 450],
      topSites: [
        { label: 'Netflix', value: 40, color: '#E50914' },
        { label: 'YouTube', value: 30, color: '#FF0000' },
        { label: 'Facebook', value: 20, color: '#1877F2' },
        { label: 'Twitter', value: 10, color: '#1DA1F2' }
      ]
    },
    'All Time': {
      dates: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      energyValues: [800, 950, 750, 880, 920, 1000],
      co2Values: [1800, 2000, 1600, 1900, 2100, 2300],
      topSites: [
        { label: 'YouTube', value: 35, color: '#FF0000' },
        { label: 'Netflix', value: 25, color: '#E50914' },
        { label: 'Facebook', value: 15, color: '#1877F2' },
        { label: 'Gmail', value: 15, color: '#D14836' },
        { label: 'Amazon', value: 10, color: '#FF9900' }
      ]
    }
  };
  
  // State for energy metrics
  const [energyData, setEnergyData] = useState({
    dates: mockData['This Week'].dates,
    energyValues: mockData['This Week'].energyValues,
    co2Values: mockData['This Week'].co2Values
  });
  
  // State for top sites
  const [topSites, setTopSites] = useState(mockData['This Week'].topSites);
  
  // State for progress tracker
  const [progressData, setProgressData] = useState({
    tipsFollowing: 3,
    actionsThisWeek: 3,
    totalActions: 124
  });
  
  // State for tips
  const [tips, setTips] = useState([
    "Close unused tabs to save energy",
    "Use dark mode when browsing at night",
    "Clear your cache regularly",
    "Optimize video quality on streaming sites"
  ]);
  
  // Load data when component mounts or time range changes
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // In a real implementation, you would fetch data from your services
        // For now, use our mock data based on the selected time range
        setEnergyData({
          dates: mockData[timeRange].dates,
          energyValues: mockData[timeRange].energyValues,
          co2Values: mockData[timeRange].co2Values
        });
        
        setTopSites(mockData[timeRange].topSites);
        
        // Update progress data based on timeRange if needed
        if (timeRange === 'This Week') {
          setProgressData({
            tipsFollowing: 3,
            actionsThisWeek: 3,
            totalActions: 124
          });
        } else if (timeRange === 'This Month') {
          setProgressData({
            tipsFollowing: 5,
            actionsThisWeek: 12,
            totalActions: 124
          });
        } else {
          setProgressData({
            tipsFollowing: 8,
            actionsThisWeek: 42,
            totalActions: 124
          });
        }
        
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      }
    };
    
    loadDashboardData();
  }, [timeRange]); // Reload when time range changes
  
  return (
    <ThemeProvider theme={theme}>
      <Box className={classes.dashboard}>
        <Box mb={3}>
          <Typography variant="h5" color="primary" gutterBottom>
            Welcome to your Dashboard
          </Typography>
        </Box>
        
        <Paper className={classes.section} elevation={0}>
          <Typography variant="h6" className={classes.sectionTitle}>
            Your Data
          </Typography>
          
          <Box>
            <Box className={classes.chartHeader}>
              <Typography variant="subtitle1" className={classes.chartTitle}>
                Energy Usage
              </Typography>
              <TabSelector activeTab={timeRange} onChange={setTimeRange} />
            </Box>
            
            <Box className={classes.chartsRow}>
              <BarChart 
                dates={energyData.dates}
                values={energyData.energyValues}
                title="Electricity (kW)"
                unit="kW"
                color="#76C893"
              />
              
              <BarChart 
                dates={energyData.dates}
                values={energyData.co2Values}
                title="CO2 Emitted (grams)"
                unit="grams"
                color="#4285F4"
              />
              
              <Box className={classes.topSites}>
                <Typography variant="subtitle2" sx={{ color: '#666666', mb: 1, textAlign: 'center' }}>
                  Top Energy Using Sites
                </Typography>
                <DoughnutChart data={topSites} />
              </Box>
            </Box>
          </Box>
        </Paper>
        
        <Paper className={classes.section} elevation={0}>
          <Typography variant="h6" className={classes.sectionTitle}>
            Progress Tracker
          </Typography>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ flex: 1, minWidth: '200px' }}>
              <ProgressItem 
                icon="📉" 
                value={progressData.tipsFollowing} 
                description="You are following less tips compared to this time last week"
              />
            </Box>
            
            <Box sx={{ flex: 1, minWidth: '200px' }}>
              <ProgressItem 
                icon="🌱" 
                value={progressData.actionsThisWeek} 
                description="Climate Helping Actions Taken This Week"
              />
            </Box>
            
            <Box sx={{ flex: 1, minWidth: '200px' }}>
              <ProgressItem 
                icon="🌍" 
                value={progressData.totalActions} 
                description="Climate Helping Actions Taken Since Downloading BetterBrowse"
              />
            </Box>
          </Box>
        </Paper>
        
        <Paper className={classes.section} elevation={0}>
          <Typography variant="h6" className={classes.sectionTitle}>
            Tips
          </Typography>
          
          <Box className={classes.tipsList}>
            {tips.map((tip, index) => (
              <Box key={index} className={classes.tipItem}>
                <Box className={classes.tipIcon}>💡</Box>
                <Box className={classes.tipText}>{tip}</Box>
              </Box>
            ))}
          </Box>
        </Paper>
      </Box>
    </ThemeProvider>
  );
};

export default Dashboard; 