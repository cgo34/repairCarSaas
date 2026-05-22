import config from '@/config';
import { computed, ref } from 'vue';
import { useTheme } from 'vuetify';

/**
 * ============================================================
 * GLOBAL STATE
 * ============================================================
 */

const sidebarDrawer = ref(config.Sidebar_drawer);

const customizerDrawer = ref(config.Customizer_drawer);

const miniSidebar = ref(config.mini_sidebar);

const fontTheme = ref(config.fontTheme);

const inputBg = ref(config.inputBg);

const currentTheme = ref<'PurpleLightTheme' | 'PurpleDarkTheme'>(
  'PurpleLightTheme'
);

/**
 * ============================================================
 * COMPOSABLE
 * ============================================================
 */

export function useCustomizerState() {
  const theme = useTheme();

  /**
   * ============================================================
   * COMPUTED
   * ============================================================
   */

  const isDarkTheme = computed(
    () => currentTheme.value === 'PurpleDarkTheme'
  );

  const themeLabel = computed(
    () => (isDarkTheme.value ? 'Sombre' : 'Clair')
  );

  /**
   * ============================================================
   * ACTIONS
   * ============================================================
   */

  const toggleTheme = () => {
    const nextTheme =
      currentTheme.value === 'PurpleDarkTheme'
        ? 'PurpleLightTheme'
        : 'PurpleDarkTheme';

    currentTheme.value = nextTheme;

    theme.global.name.value = nextTheme;
  };

  const toggleSidebarDrawer = () => {
    sidebarDrawer.value = !sidebarDrawer.value;
  };

  const setMiniSidebar = (value: boolean) => {
    miniSidebar.value = value;
  };

  const setCustomizerDrawer = (value: boolean) => {
    customizerDrawer.value = value;
  };

  const setFont = (value: string) => {
    fontTheme.value = value;
  };

  const setInputBg = (value: boolean) => {
    inputBg.value = value;
  };

  const resetCustomizer = () => {
    fontTheme.value = 'Roboto';

    inputBg.value = false;

    miniSidebar.value = false;

    currentTheme.value = 'PurpleLightTheme';

    theme.global.name.value = 'PurpleLightTheme';
  };

  /**
   * ============================================================
   * EXPORT
   * ============================================================
   */

  return {
    // state
    sidebarDrawer,
    customizerDrawer,
    miniSidebar,
    fontTheme,
    inputBg,
    currentTheme,

    // computed
    isDarkTheme,
    themeLabel,

    // actions
    toggleTheme,
    toggleSidebarDrawer,
    setMiniSidebar,
    setCustomizerDrawer,
    setFont,
    setInputBg,
    resetCustomizer,
  };
}