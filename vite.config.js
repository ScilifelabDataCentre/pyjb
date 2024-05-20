import { defineConfig } from "vite";
import anywidget from "@anywidget/vite"

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
	    // rely on relative imports.
	    output: {
		manualChunks: () => 'vendor'
	    }
	},
    },
    define: {
	// Necessary to avoid failing accesses to `process.env` in the
	// output bundle.
	'process.env': {}
    },
    plugins: [anywidget()]
});
