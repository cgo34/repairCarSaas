import type { ThemeTypes } from '@/types/themeTypes/ThemeType';

const SpeechBlueDarkTheme: ThemeTypes = {
  name: 'dark',
  dark: true,
  variables: {
    'border-color': '#1e88e5',
    'carousel-control-size': 10
  },
  colors: {
    primary: '#0d47a1',
    secondary: '#1976d2',
    info: '#03c9d7',
    success: '#00c853',
    accent: '#FFAB91',
    warning: '#ffc107',
    error: '#f44336',
    lightprimary: '#90caf9',
    lightsecondary: '#e3f2fd',
    lightsuccess: '#b9f6ca',
    lighterror: '#f9d8d8',
    lightwarning: '#fff8e1',
    darkText: '#212121',
    lightText: '#616161',
    darkprimary: '#082567',
    darksecondary: '#0b3d91',
    darksuccess: '#00e676',
    darkerror: '#e53935',
    darkwarning: '#fbc02d',
    background: '#f5f5f5',
    surface: '#ffffff'
  }
};

export default SpeechBlueDarkTheme;
