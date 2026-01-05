import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  // Used to check the app on my phone
  // server: {
  //   host: true,
  // },
});
