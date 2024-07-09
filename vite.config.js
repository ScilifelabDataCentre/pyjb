import { resolve } from 'path'
import { defineConfig } from 'vite';
import anywidget from '@anywidget/vite'
import react from '@vitejs/plugin-react'
import { polyfillNode } from "esbuild-plugin-polyfill-node";

export default defineConfig({
    build: {
	outDir: resolve(__dirname, 'pyjb/static'),
	lib: {
	    entry: resolve(__dirname, 'src/index.js'),
	    fileName: 'index',
	    formats: ['es'],
	},
	rollupOptions: {
	    // ipywidget expects a self-contained ESM file
	    output: {
		manualChunks: () => 'vendor'
	    }
	},
    },
    define: {
	// Necessary to avoid failing accesses to `process.env` in the
	// output bundle.
	'process.env.NODE_ENV': '"production"'
    },
    plugins: [
	anywidget(),
	react(),
    ],
    optimizeDeps: {
	esbuildOptions: {
	    plugins: [polyfillNode()]
	}
    }

});
