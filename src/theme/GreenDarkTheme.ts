import type { ThemeTypes } from '@/types/themeTypes/ThemeType';

const GreenDarkTheme: ThemeTypes = {
  name: 'dark',
  dark: true,
  variables: {
    'border-color': '#1e88e5',
    'carousel-control-size': 10
  },
  colors: {
    primary: '#2e7d32',
    secondary: '#388e3c',
    info: '#03c9d7',
    success: '#00c853',
    accent: '#FFAB91',
    warning: '#ffc107',
    error: '#f44336',
    lightprimary: '#a5d6a7',
    lightsecondary: '#c8e6c9',
    lightsuccess: '#b9f6ca',
    lighterror: '#f9d8d8',
    lightwarning: '#fff8e1',
    darkText: '#212121',
    lightText: '#616161',
    darkprimary: '#1b5e20',
    darksecondary: '#004d40',
    darksuccess: '#00e676',
    darkerror: '#e53935',
    darkwarning: '#fbc02d',
    background: '#f5f5f5',
    surface: '#ffffff'
  }
};

export default GreenDarkTheme;
