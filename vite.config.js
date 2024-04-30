import { defineConfig } from "vite";

export default defineConfig({
    build: {
	outDir: "lgv_widget/static",
	lib: {
	    entry: ["src/index.js"],
	    filename: 'index',
	    formats: ["es"],
	},
	rollupOptions: {
	    output: {
		manualChunks: () => 'vendor'
	    }
	},
    },
    define: {
	    'process.env': {}
    }
});
