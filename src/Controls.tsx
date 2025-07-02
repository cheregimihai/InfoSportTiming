import React, { useState } from 'react';
import { Button, TextField, useTheme } from '@mui/material';

interface ControlsProps {
  onAdjustTime: (amount: number) => void;
  onManualTimeSet: (time: number) => void;
}

const Controls: React.FC<ControlsProps> = ({ onAdjustTime, onManualTimeSet }) => {
  const [manualInput, setManualInput] = useState('');
  const theme = useTheme();

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
        <Button onClick={() => onAdjustTime(-5)} sx={{
          backgroundColor: theme.palette.secondary.main,
          color: theme.palette.secondary.contrastText,
          '&:hover': {
            backgroundColor: theme.palette.secondary.dark,
          },
        }}>-5s</Button>
        <Button onClick={() => onAdjustTime(-1)} sx={{
          backgroundColor: theme.palette.secondary.main,
          color: theme.palette.secondary.contrastText,
          '&:hover': {
            backgroundColor: theme.palette.secondary.dark,
          },
        }}>-1s</Button>
        <TextField
          label="MM:SS"
          variant="outlined"
          value={manualInput}
          onChange={handleManualInputChange}
          onBlur={handleManualSet}
          onKeyPress={(e) => { if (e.key === 'Enter') handleManualSet(); }}
          sx={{ width: '100px' }} /* Adjust width as needed */
        />
        <Button onClick={() => onAdjustTime(1)} sx={{
          backgroundColor: theme.palette.secondary.main,
          color: theme.palette.secondary.contrastText,
          '&:hover': {
            backgroundColor: theme.palette.secondary.dark,
          },
        }}>+1s</Button>
        <Button onClick={() => onAdjustTime(5)} sx={{
          backgroundColor: theme.palette.secondary.main,
          color: theme.palette.secondary.contrastText,
          '&:hover': {
            backgroundColor: theme.palette.secondary.dark,
          },
        }}>+5s</Button>
      </div>
    </div>
  );
};

export default Controls;
