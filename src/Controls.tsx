
import React, { useState } from 'react';

interface ControlsProps {
  isActive: boolean;
  onStartPause: () => void;
  onAdjustTime: (amount: number) => void;
  onManualTimeSet: (time: number) => void;
}

const Controls: React.FC<ControlsProps> = ({ isActive, onStartPause, onAdjustTime, onManualTimeSet }) => {
  const [manualInput, setManualInput] = useState('');

  const handleManualInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setManualInput(e.target.value);
  };

  const handleManualSet = () => {
    const [minutes, seconds] = manualInput.split(':').map(Number);
    if (!isNaN(minutes) && !isNaN(seconds)) {
      onManualTimeSet(minutes * 60 + seconds);
      setManualInput('');
    }
  };

  return (
    <div className="controls">
      <div className="adjustment-controls">
        <button onClick={() => onAdjustTime(-5)}>-5s</button>
        <button onClick={() => onAdjustTime(-1)}>-1s</button>
        <input
          type="text"
          placeholder="MM:SS"
          value={manualInput}
          onChange={handleManualInputChange}
          onBlur={handleManualSet}
          onKeyPress={(e) => { if (e.key === 'Enter') handleManualSet(); }}
        />
        <button onClick={() => onAdjustTime(1)}>+1s</button>
        <button onClick={() => onAdjustTime(5)}>+5s</button>
      </div>
      <div className="start-pause-control">
        <button onClick={onStartPause} className="start-pause-button">
          {isActive ? 'Pause' : 'Start'}
        </button>
      </div>
    </div>
  );
};

export default Controls;
