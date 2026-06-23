import type { ThemeTypes } from '@/types/themeTypes/ThemeType';

const PurpleLightTheme: ThemeTypes = {
  name: 'light',
  dark: false,
  variables: {
    'border-color': '#2B54E0',
    'carousel-control-size': 10
  },
  colors: {
    primary:         '#2B54E0',  // Bleu précision
    secondary:       '#9AA2B1',  // Brouillon / neutre
    info:            '#2B54E0',  // Envoyée (même bleu)
    success:         '#15915F',  // Payée
    accent:          '#F5871F',  // Ambre carrosserie
    warning:         '#F5871F',  // Ambre carrosserie
    error:           '#D8443A',  // En retard

    lightprimary:    '#EBF0FB',
    lightsecondary:  '#F0F2F5',
    lightsuccess:    '#E6F4EF',
    lighterror:      '#FAEAEA',
    lightwarning:    '#FEF3E8',

    darkprimary:     '#1D3DB5',
    darksecondary:   '#6B7A90',

    darkText:        '#0F1626',  // Bleu nuit atelier
    lightText:       '#5A6478',
    borderLight:     '#D8DEEB',
    inputBorder:     '#9AA2B1',
    containerBg:     '#F4F6FB',
    surface:         '#FFFFFF',
    'on-surface-variant': '#FFFFFF',

    gray100:         '#F8F9FC',
    primary200:      '#A8BFEF',
    secondary200:    '#CBD0D9',

    navBg:           '#0F1626',  // Sidebar dark

    facebook:        '#4267b2',
    twitter:         '#1da1f2',
    linkedin:        '#0e76a8',
  }
};

export { PurpleLightTheme };
