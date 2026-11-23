import vue from '@vitejs/plugin-vue';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [vue()],
    define: {
      'process.env': env,  // Chargement des variables d'env
    },
    server: {
      port: 3000
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '@assets': path.resolve(__dirname, 'src/assets'),
      },
    },
    css: {
      preprocessorOptions: {
        scss: {}
      }
    },
  };
});
