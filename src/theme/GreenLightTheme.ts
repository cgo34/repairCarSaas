import type { ThemeTypes } from '@/types/themeTypes/ThemeType';

const GreenLightTheme: ThemeTypes = {
  name: 'light',
  dark: false,
  variables: {
    'border-color': '#1e88e5',
    'carousel-control-size': 10
  },
  colors: {
    primary: '#43a047',
    secondary: '#66bb6a',
    info: '#03c9d7',
    success: '#00c853',
    accent: '#FFAB91',
    warning: '#ffc107',
    error: '#f44336',
    lightprimary: '#e8f5e9',
    lightsecondary: '#c8e6c9',
    lightsuccess: '#b9f6ca',
    lighterror: '#f9d8d8',
    lightwarning: '#fff8e1',
    darkText: '#212121',
    lightText: '#616161',
    darkprimary: '#1e4620',
    darksecondary: '#2e7d32',
    darksuccess: '#00e676',
    darkerror: '#e53935',
    darkwarning: '#fbc02d',
    background: '#f5f5f5',
    surface: '#ffffff'
  }
};

export default GreenLightTheme;
