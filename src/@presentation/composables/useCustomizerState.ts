import config from '@/config';
import { computed, ref } from 'vue';
import { useTheme } from 'vuetify';

 // État
const sidebarDrawer = ref(config.Sidebar_drawer);
const customizerDrawer = ref(config.Customizer_drawer);
const miniSidebar = ref(config.mini_sidebar);
const fontTheme = ref(config.fontTheme);
const inputBg = ref(config.inputBg);
const currentTheme = ref('PurpleDarkTheme');

export function useCustomizerState() {
  const theme = useTheme();
  theme.global.name.value = currentTheme.value;

  // Fonction pour basculer entre les thèmes "light" et "dark"
  const toggleTheme = (newValue: boolean | null) => {
    const selectedTheme = newValue ? 'PurpleDarkTheme' : 'PurpleLightTheme';
    theme.global.name.value = selectedTheme;
    currentTheme.value = selectedTheme; // Synchronise la variable globale
  };

  const themeLabel = computed(() => {
    return currentTheme.value === 'PurpleDarkTheme' ? 'Dark' : 'Light';
  });

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
    themeLabel,

    // Actions
    toggleSidebarDrawer,
    setMiniSidebar,
    setCustomizerDrawer,
    setFont,
    toggleTheme
  };
}