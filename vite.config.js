import { defineConfig } from 'vite'

export default defineConfig({
  root: '.',
  publicDir: 'public',
  base: '/blaziken-v3/',
  build: {
    outDir: 'dist',
  },
})
