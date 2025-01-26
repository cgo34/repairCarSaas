import config from '@/config';
import { ref } from 'vue';

 // État
 const sidebarDrawer = ref(config.Sidebar_drawer);
 const customizerDrawer = ref(config.Customizer_drawer);
 const miniSidebar = ref(config.mini_sidebar);
 const fontTheme = ref(config.fontTheme);
 const inputBg = ref(config.inputBg);

export function useCustomizerState() {
 
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

    // Actions
    toggleSidebarDrawer,
    setMiniSidebar,
    setCustomizerDrawer,
    setFont
  };
}