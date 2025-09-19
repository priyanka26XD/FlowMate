import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// app config
const app = express ()
const port = process.env.PORT || 4000;
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})
