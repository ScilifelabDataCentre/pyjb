import  { readFileSync } from "node:fs";
import  { resolve } from "node:path";

let hmrPath = resolve(__dirname, "hmr.raw.js");

function injectHmr(src, hmrSrc) {
    return src.replace("async function render", "export async function _render")
	.replace(/export default \{\s*render\s*\}/, `${hmrSrc}\nexport default { render }`);
}

export default function (options) {
    let include = /index.js/;
    let exclude = /node_modules/;
    let hmrSrc = readFileSync(hmrPath);
    return {
	name: "pyjb-hmr",
	apply: "serve",
	transform (code, id) {
	    if (include.test(id) && !exclude.test(id)) {
		console.log("Injecting HMR snippet into", id);
		return injectHmr(code, hmrSrc)
	    }
	}
    }
}
