import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    // Enable minification optimizations
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    // Enable chunk splitting
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'chart-vendor': ['lightweight-charts'],
          'ui-vendor': ['lucide-react', 'react-draggable']
        }
      }
    },
    // Enable source map optimization
    sourcemap: false,
    // Reduce chunk size
    chunkSizeWarningLimit: 1000
  },
  // Enable asset optimization
  assetsInclude: ['**/*.{png,jpg,gif,svg,webp}'],
  // Enable caching and SPA fallback
  server: {
    force: false,
    historyApiFallback: true
  }
});