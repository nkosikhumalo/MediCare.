import process from 'node:process'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  if (command === 'build' && mode === 'production' && !env.VITE_API_BASE?.trim()) {
    throw new Error(
      'VITE_API_BASE must be set for production builds. Set it to the public URL of the Node BFF (for this deployment: https://medicare-ze3o.onrender.com).',
    );
  }

  return {
    plugins: [react()],
  };
})
