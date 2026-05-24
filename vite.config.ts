import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor':  ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor':     ['lucide-react', 'recharts', 'clsx'],
          'data-vendor':   ['@supabase/supabase-js', '@tanstack/react-query', 'zustand'],
        },
      },
    },
  },
})
