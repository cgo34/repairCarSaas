import GreenLightTheme from '@/theme/GreenLightTheme';
import { PinkDarkTheme } from '@/theme/PinkDarkTheme';
import { PinkLightTheme } from '@/theme/PinkLightTheme';
import { PurpleDarkTheme } from '@/theme/PurpleDarkTheme';
import { PurpleLightTheme } from '@/theme/PurpleLightTheme';
import YellowLightTheme from '@/theme/YellowLightTheme';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { aliases } from 'vuetify/iconsets/mdi-svg';
import { icons } from './mdi-icon'; // Import icons from separate file

export default createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases: {
      ...aliases,
      ...icons
    },
  },
  theme: {
    defaultTheme: 'PurpleLightTheme',
    themes: {
      PurpleLightTheme,
      PurpleDarkTheme,
      PinkLightTheme,
      PinkDarkTheme,
      GreenLightTheme,
      YellowLightTheme
    }
  },
  defaults: {
    VBtn: {},
    VCard: {
      rounded: 'md'
    },
    VTextField: {
      rounded: 'lg'
    },
    VTooltip: {
      // set v-tooltip default location to top
      location: 'top'
    }
  }
});