import { defineConfig } from 'electron-vite'
import { resolve } from 'node:path'

export default defineConfig({
  main: {
    build: {
      sourcemap: true
    }
  },
  preload: {
    build: {
      sourcemap: true
    }
  },
  renderer: {
    build: {
      sourcemap: true
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src/renderer')
      }
    }
  }
})
