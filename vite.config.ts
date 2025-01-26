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
        '@application': path.resolve(__dirname, 'src/@application'),
        '@domain': path.resolve(__dirname, 'src/@domain'),
        '@infrastructure': path.resolve(__dirname, 'src/@infrastructure'),
        '@ui': path.resolve(__dirname, 'src/@presentation/@ui'),
        '@modules': path.resolve(__dirname, 'src/@presentation/@modules'),
        '@router': path.resolve(__dirname, 'src/router'),
        '@plugins': path.resolve(__dirname, 'src/plugins'),
        '@theme': path.resolve(__dirname, 'src/theme'),
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
