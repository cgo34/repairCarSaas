import type { ThemeTypes } from '@/types/themeTypes/ThemeType';

const PurpleDarkTheme: ThemeTypes = {
  name: 'dark',
  dark: true,
  variables: {
    'border-color': '#2B54E0',
    'carousel-control-size': 10
  },
  colors: {
    primary:         '#2B54E0',  // Bleu précision
    secondary:       '#9AA2B1',  // Neutre
    info:            '#2B54E0',
    success:         '#15915F',
    accent:          '#F5871F',
    warning:         '#F5871F',
    error:           '#D8443A',

    lightprimary:    '#1D2E50',
    lightsecondary:  '#1A2236',
    lightsuccess:    '#0E2E22',
    lighterror:      '#2A1A1A',
    lightwarning:    '#2A1F0E',

    darkprimary:     '#1D3DB5',
    darksecondary:   '#3D4F6E',

    darkText:        '#D7DCEC',
    lightText:       '#8B96A8',
    borderLight:     '#2A3550',
    inputBorder:     '#3D4F6E',
    containerBg:     '#1A2236',
    surface:         '#0F1626',
    'on-surface-variant': '#0F1626',

    gray100:         '#131D30',
    primary200:      '#A8BFEF',
    secondary200:    '#5A6478',

    navBg:           '#080E1C',  // Sidebar encore plus sombre

    facebook:        '#4267b2',
    twitter:         '#1da1f2',
    linkedin:        '#0e76a8',
  }
};

export { PurpleDarkTheme };
