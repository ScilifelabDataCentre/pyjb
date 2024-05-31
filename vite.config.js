import { resolve } from 'path'
import { defineConfig } from 'vite';
import { polyfillNode } from "esbuild-plugin-polyfill-node";
import hmrPlugin from './src/vite/hmrPlugin.js'

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
    plugins: [hmrPlugin()],
    optimizeDeps: {
	esbuildOptions: {
	    plugins: [polyfillNode()]
	}
    }

});
