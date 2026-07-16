import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, loadEnv } from 'vite';
import path from 'node:path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, path.resolve(process.cwd(), '..'), '');
  const web_port = parseInt(env.WEB_PORT ?? '3002');
  const apiPort = parseInt(env.API_PORT ?? '3001');

  return {
    plugins: [sveltekit()],
    server: {
      web_port,
      proxy: {
        '/api':    { target: `http://localhost:${apiPort}`, changeOrigin: true },
        '/health': { target: `http://localhost:${apiPort}`, changeOrigin: true },
      },
    },
  };
});
