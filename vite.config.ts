import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/inner/',
  define: {
    'import.meta.env.VITE_SUPABASE_URL': JSON.stringify('https://wmnmnmnpqnfnlmtegltz.supabase.co'),
    'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify('твой_анонимный_ключ'),
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});