import React, { useState, useEffect, useCallback } from 'react';
import TimerDisplay from './TimerDisplay';
import Controls from './Controls';
import './App.css';
import { triggerShellyRelay } from './shellyService';
import { Button, ThemeProvider, createTheme, Typography } from '@mui/material';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00838F', // Deep Teal/Cyan
    },
    secondary: {
      main: '#FFB300', // Warm Amber
    },
    background: {
      default: '#1A1A1A', // Very dark gray
      paper: '#2C2C2C', // Slightly lighter dark gray for components
    },
    text: {
      primary: '#E0E0E0', // Soft light gray
      secondary: '#A0A0A0', // Medium gray
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif', // A more common and readable font
    h1: {
      fontSize: '30vh', // Keep this for TimerDisplay
      fontFamily: 'monospace',
    },
  },
  components: {
    MuiButton: {
      defaultProps: {
        variant: 'contained', // Default all buttons to contained
      },
      styleOverrides: {
        root: {
          fontSize: '2.5vh', // Slightly larger font for better readability
          padding: '1.5vh 3vh', // Adjusted padding
          borderRadius: '8px', // Slightly less rounded corners
          border: 'none', // Remove border, rely on shadow/background
          backgroundColor: '#424242', // Default button background
          color: '#e0e0e0', // Default text color
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.4)', // Subtle shadow for depth
          '&:hover': {
            backgroundColor: '#616161', // Lighter on hover
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.6)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiInputBase-input': {
            color: '#e0e0e0',
            textAlign: 'center',
            fontSize: '2.5vh',
            padding: '1.5vh 2vh',
          },
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#616161', // Softer border color
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#00838F', // Primary color on hover
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#00838F', // Primary color when focused
          },
          '& .MuiInputLabel-root': {
            color: '#A0A0A0',
            fontSize: '2.5vh',
          },
        },
      },
    },
  },
});

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
    <ThemeProvider theme={theme}>
      <div className="App">
        <TimerDisplay time={time} />
        <div className="start-pause-control">
          <Button onClick={handleStartPause} sx={{
            fontSize: '8vh',
            padding: '2vh 8vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: theme.palette.primary.main, // Use primary color
            color: theme.palette.primary.contrastText, // Use contrast text color
            '&:hover': {
              backgroundColor: theme.palette.primary.dark, // Darker primary on hover
            },
          }}>
            {isActive ? 'Pause' : 'Start'}
          </Button>
        </div>
        <Controls
          onAdjustTime={handleAdjust}
          onManualTimeSet={handleManualTimeSet}
        />
      </div>
    </ThemeProvider>
  );
};

export default App;
