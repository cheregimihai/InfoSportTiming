import React, { useState, useEffect, useCallback } from 'react';
import TimerDisplay from './TimerDisplay';
import Controls from './Controls';
import './App.css';
import { triggerShellyRelay } from './shellyService';

const App: React.FC = () => {
  // Initialize state from localStorage or defaults
  const [time, setTime] = useState<number>(() => {
    const savedTime = localStorage.getItem('timerTime');
    return savedTime ? JSON.parse(savedTime) : 0;
  });

  const [isActive, setIsActive] = useState<boolean>(false);

  // Persist state to localStorage
  useEffect(() => {
    localStorage.setItem('timerTime', JSON.stringify(time));
  }, [time]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    const pausePoints = [1800, 3600, 3900, 4200, 4500, 4800]; // 30:00, 60:00, 65:00, 70:00, 75:00, 80:00

    if (isActive) {
      interval = setInterval(() => {
        setTime(prevTime => {
          const newTime = prevTime + 1;
          if (pausePoints.includes(newTime)) {
            setIsActive(false);
            console.log(`Timer paused at ${newTime / 60}:00`);
            triggerShellyRelay();
            return newTime;
          }
          if (newTime > 4800) { // Prevent going beyond 80:00
            setIsActive(false);
            return 4800;
          }
          return newTime;
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isActive]);

  const handleStartPause = () => {
    setIsActive(!isActive);
  };

  const handleAdjust = (amount: number) => {

    setTime(prevTime => {
      const newTime = prevTime + amount;
      const maxTime = 4800; // 80:00

      if (newTime < 0) return 0;
      if (newTime > maxTime) return maxTime;

      // Prevent jumping over pause points
      const nextPausePoint = [1800, 3600, 3900, 4200, 4500, 4800].find(point => {
        if (amount > 0) return prevTime < point && newTime >= point;
        if (amount < 0) return prevTime > point && newTime <= point;
        return false;
      });

      if (nextPausePoint !== undefined) {
        return nextPausePoint;
      }

      return newTime;
    });
  };
  
  const handleManualTimeSet = (newTime: number) => {
    if (isActive || isNaN(newTime)) return;
    
    const maxTime = 4800; // 80:00
    if (newTime < 0) {
        setTime(0);
    } else if (newTime > maxTime) {
        setTime(maxTime);
    } else {
        setTime(newTime);
    }
  };

  return (
    <div className="App">
      <TimerDisplay time={time} />
      <Controls
        isActive={isActive}
        onStartPause={handleStartPause}
        onAdjustTime={handleAdjust}
        onManualTimeSet={handleManualTimeSet}
      />
    </div>
  );
};

export default App;