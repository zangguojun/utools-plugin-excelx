import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import utools from 'vite-plugin-utools'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: [
      {
        // this is required for the SCSS modules
        find: /^~(.*)$/,
        replacement: '$1'
      }
    ]
  },
  plugins: [
    react(),
    utools({
      external: 'uTools',
      preload: {
        path: './src/preload.js',
        watch: true,
        name: 'window.preload'
      },
      buildUpx: {
        pluginPath: './plugin.json',
        outDir: 'upx',
        outName: '[pluginName]_[version].upx'
      }
    })
  ]
})
