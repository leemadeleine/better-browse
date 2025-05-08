import React from 'react';

interface WeeklyChartProps {
  dates: string[];
  savings: number[];
}

const WeeklyChart: React.FC<WeeklyChartProps> = ({ dates, savings }) => {
  // Find the maximum value to scale the chart
  const maxSaving = Math.max(...savings);
  
  return (
    <div className="weekly-chart">
      <h3 className="chart-title">Weekly CO₂ Savings</h3>
      
      <div className="chart-container">
        {dates.map((date, index) => (
          <div key={index} className="chart-bar-container">
            <div 
              className="chart-bar" 
              style={{ 
                height: `${(savings[index] / maxSaving) * 100}%`,
                backgroundColor: savings[index] > 5 ? '#4CAF50' : '#81C784'
              }}
            >
              <span className="chart-value">{savings[index].toFixed(1)}</span>
            </div>
            <div className="chart-label">{date}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeeklyChart; 