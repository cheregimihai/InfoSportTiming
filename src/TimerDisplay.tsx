
import React from 'react';

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
      <h1>{formatTime(time)}</h1>
    </div>
  );
};

export default TimerDisplay;
