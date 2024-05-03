import { defineConfig } from "vite";

export default defineConfig({
    build: {
	outDir: "pyjb/static",
	lib: {
	    entry: ["src/index.js"],
	    filename: 'index',
	    formats: ["es"],
	},
	rollupOptions: {
	    // ipywidget expects a self-contained ESM file, we cannot
	    // rely relative imports.
	    output: {
		manualChunks: () => 'vendor'
	    }
	},
    },
    define: {
	// Necessary to avoid failing accesses to `process.env` in the
	// output bundle.
	'process.env': {}
    }
});
