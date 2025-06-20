import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
	plugins: [react()],
	server: { open: true },
	publicDir: 'assets',
	assetsInclude: ['**/*.gltf'],
	build: { target: 'esnext' },
})
