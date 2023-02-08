import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import utools from 'vite-plugin-utools'
import { read, utils } from 'xlsx'
import { readFileSync } from 'fs'

const sheetMather = /\?sheetjs-((\d+)|all)$/

// https://vitejs.dev/config/
export default defineConfig({
  assetsInclude: ['**/*.xlsx'],
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
    }),
    {
      name: 'vite-sheet',
      transform (code, id) {
        const reMatcher = id.match(sheetMather)
        if (!reMatcher) return

        const opts = {}
        if (reMatcher[1] !== 'all') opts.sheetRows = Number(reMatcher[1])

        const wb = read(readFileSync(id.replace(sheetMather, '')), opts)
        const data = utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]])

        return `export default JSON.parse('${JSON.stringify(data)}')`
      }
    }
  ]
})
