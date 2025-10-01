import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  const isProduction = mode === 'production'
  
  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    
    // Configuration du serveur de développement
    server: {
      port: 5173,
      host: true,
      proxy: {
        // tout ce qui commence par /api sera redirigé vers ton backend
        '/api': {
          target: 'http://localhost:3000',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
    
    // Configuration de build pour la production
    build: {
      target: 'esnext',
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: !isProduction,
      minify: isProduction ? 'esbuild' : false,
      
      // Optimisation des chunks
      rollupOptions: {
        output: {
          manualChunks: {
            // Vendor chunks pour un meilleur cache
            'react-vendor': ['react', 'react-dom'],
            'router-vendor': ['react-router-dom'],
            'query-vendor': ['@tanstack/react-query'],
            'form-vendor': ['react-hook-form', '@hookform/resolvers', 'zod'],
            'ui-vendor': ['@radix-ui/react-dialog', '@radix-ui/react-select', '@radix-ui/react-label'],
            'chart-vendor': ['recharts'],
          },
          // Nommage des fichiers pour le cache
          chunkFileNames: (chunkInfo) => {
            const facadeModuleId = chunkInfo.facadeModuleId
            if (facadeModuleId) {
              const name = facadeModuleId.split('/').pop().replace(/\.[^.]*$/, '')
              return `js/${name}-[hash].js`
            }
            return 'js/[name]-[hash].js'
          },
          entryFileNames: 'js/[name]-[hash].js',
          assetFileNames: (assetInfo) => {
            const info = assetInfo.name.split('.')
            const ext = info[info.length - 1]
            if (/\.(png|jpe?g|svg|gif|tiff|bmp|ico)$/i.test(assetInfo.name)) {
              return `images/[name]-[hash].${ext}`
            }
            if (/\.(css)$/i.test(assetInfo.name)) {
              return `css/[name]-[hash].${ext}`
            }
            return `assets/[name]-[hash].${ext}`
          }
        }
      },
      
      // Optimisation de la taille
      chunkSizeWarningLimit: 1000,
    },
    
    // Optimisation des dépendances
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-router-dom',
        '@tanstack/react-query',
        'react-hook-form',
        'zod',
        'axios',
        'zustand'
      ],
    },
    
    // Configuration PWA
    define: {
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version || '1.0.0'),
      __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
    },
    
    // Configuration des assets
    assetsInclude: ['**/*.woff', '**/*.woff2'],
    
    // Configuration CSS
    css: {
      devSourcemap: !isProduction,
      postcss: './postcss.config.js',
    },
    
    // Configuration preview pour la production
    preview: {
      port: 4173,
      host: true,
    }
  }
})
