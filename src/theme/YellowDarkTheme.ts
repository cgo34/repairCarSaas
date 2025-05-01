import type { ThemeTypes } from '@/types/themeTypes/ThemeType';

const YellowDarkTheme: ThemeTypes = {
  name: 'dark',
  dark: true,
  variables: {
    'border-color': '#1e88e5',
    'carousel-control-size': 10
  },
  colors: {
    primary: '#f9a825',
    secondary: '#fdd835',
    info: '#03c9d7',
    success: '#00c853',
    accent: '#FFAB91',
    warning: '#ffc107',
    error: '#f44336',
    lightprimary: '#fff59d',
    lightsecondary: '#ffecb3',
    lightsuccess: '#b9f6ca',
    lighterror: '#f9d8d8',
    lightwarning: '#fff8e1',
    darkText: '#212121',
    lightText: '#616161',
    darkprimary: '#f57f17',
    darksecondary: '#fbc02d',
    darksuccess: '#00e676',
    darkerror: '#e53935',
    darkwarning: '#fbc02d',
    background: '#f5f5f5',
    surface: '#ffffff'
  }
};

export default YellowDarkTheme;
