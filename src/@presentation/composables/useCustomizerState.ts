import config from '@/config';
import { computed, ref } from 'vue';
import { useTheme } from 'vuetify';

 // État
const sidebarDrawer = ref(config.Sidebar_drawer);
const customizerDrawer = ref(config.Customizer_drawer);
const miniSidebar = ref(config.mini_sidebar);
const fontTheme = ref(config.fontTheme);
const inputBg = ref(config.inputBg);
const currentTheme = ref('PurpleLightTheme');

export function useCustomizerState() {
  const theme = useTheme();

  // Bascule entre le thème clair et sombre
  const toggleTheme = () => {
    const isDark = currentTheme.value === 'PurpleDarkTheme';
    const next = isDark ? 'PurpleLightTheme' : 'PurpleDarkTheme';
    theme.global.name.value = next;
    currentTheme.value = next;
  };

  const isDarkTheme = computed(() => currentTheme.value === 'PurpleDarkTheme');

  const themeLabel = computed(() => isDarkTheme.value ? 'Sombre' : 'Clair');

  // Actions
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

  return {
    // État
    sidebarDrawer,
    customizerDrawer,
    miniSidebar,
    fontTheme,
    inputBg,
    currentTheme,
    isDarkTheme,
    themeLabel,

    // Actions
    toggleSidebarDrawer,
    setMiniSidebar,
    setCustomizerDrawer,
    setFont,
    toggleTheme
  };
}