import React, { useState, useEffect } from 'react';

const CircularProgress = ({
  percentage = 75,
  size = 120,
  strokeWidth = 8,
  colorClass = 'text-green-300',
  bgColorClass = 'text-red-400',
  speed = 20,
}) => {
  const [current, setCurrent] = useState(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    let mounted = true;
    const timer = setInterval(() => {
      setCurrent(prev => {
        if (!mounted || prev >= percentage) {
          clearInterval(timer);
          return percentage;
        }
        return prev + 1;
      });
    }, speed);
    return () => {
      mounted = false;
      clearInterval(timer);
    };
  }, [percentage, speed]);

  const offset = circumference - (current / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center"
         style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          className={bgColorClass + ' stroke-current'}
          strokeWidth={strokeWidth}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
        />
        <circle
          className={colorClass + ' stroke-current'}
          strokeWidth={strokeWidth}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.3s ease-out' }}
        />
      </svg>
      <span className="absolute font-medium">{current}%</span>
    </div>
  );
};

export default CircularProgress;
