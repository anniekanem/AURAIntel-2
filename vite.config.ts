
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  // Cast process to any to resolve TS error: Property 'cwd' does not exist on type 'Process'.
  const env = loadEnv(mode, (process as any).cwd(), '');
  return {
    plugins: [react()],
    define: {
      // Prioritize the actual process environment variable (passed from Docker/Cloud Build)
      // over the .env file if available.
      'process.env.API_KEY': JSON.stringify(process.env.API_KEY || env.API_KEY)
    },
    server: {
      port: 3000
    }
  };
});
