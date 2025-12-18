import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
// Fix: Import process from node:process to provide proper Node.js types and functionality for process.cwd()
import process from 'node:process';

export default defineConfig(({ mode }) => {
  // Load environment variables based on the current mode (development, production, etc.)
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    define: {
      // Prioritize the real environment variable (passed via Docker build args)
      // then fall back to the .env file if available.
      'process.env.API_KEY': JSON.stringify(process.env.API_KEY || env.API_KEY)
    },
    server: {
      port: 3000
    },
    build: {
      outDir: 'dist',
      sourcemap: false
    }
  };
});
