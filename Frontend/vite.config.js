import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {},
  },
  plugins: [
    tailwindcss(),
  ],
  server:{
    proxy:{
      '/api': "http://localhost:3000"
    }
  }
})
