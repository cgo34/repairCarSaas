import type { ThemeTypes } from '@/types/themeTypes/ThemeType';

const SeaGreenDarkTheme: ThemeTypes = {
  name: 'dark',
  dark: true,
  variables: {
    'border-color': '#1e88e5',
    'carousel-control-size': 10
  },
  colors: {
    primary: '#004d40',
    secondary: '#00695c',
    info: '#03c9d7',
    success: '#00c853',
    accent: '#FFAB91',
    warning: '#ffc107',
    error: '#f44336',
    lightprimary: '#80cbc4',
    lightsecondary: '#b2dfdb',
    lightsuccess: '#b9f6ca',
    lighterror: '#f9d8d8',
    lightwarning: '#fff8e1',
    darkText: '#212121',
    lightText: '#616161',
    darkprimary: '#00251a',
    darksecondary: '#00332d',
    darksuccess: '#00e676',
    darkerror: '#e53935',
    darkwarning: '#fbc02d',
    background: '#f5f5f5',
    surface: '#ffffff'
  }
};

export default SeaGreenDarkTheme;
