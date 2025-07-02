import React from 'react';
import { Typography } from '@mui/material';

interface TimerDisplayProps {
  time: number;
}

const formatTime = (timeInSeconds: number) => {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = timeInSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

const TimerDisplay: React.FC<TimerDisplayProps> = ({ time }) => {
  return (
    <div className="timer-display">
      <Typography variant="h1" sx={{ fontSize: '15vh', fontFamily: 'monospace' }}>{formatTime(time)}</Typography>
    </div>
  );
};

export default TimerDisplay;