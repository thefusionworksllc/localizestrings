'use client';

import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { Brightness4, WbSunny, Nightlight } from '@mui/icons-material'; // Changed Brightness7 to WbSunny
import { useTheme } from '../contexts/ThemeContext';

export default function ThemeToggle() {
  const { mode, toggleMode } = useTheme();
  
  return (
    <Tooltip title={mode === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
      <IconButton onClick={toggleMode} color="inherit" aria-label="toggle theme">
        {mode === 'dark' ? <Nightlight /> : <WbSunny />} {/* Use WbSunny icon for light mode */}
      </IconButton>
    </Tooltip>
  );
}