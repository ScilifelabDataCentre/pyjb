import {
    createViewState,
    JBrowseLinearGenomeView,
} from '@jbrowse/react-linear-genome-view'
import { createElement } from 'react'
import { createRoot } from 'react-dom/client'
import { assembly, featureTrack, URL_KEYS} from './config'
import { resolveUrlProperties } from './utils'

console.debug("[pyjb] Loading `index.js`");

export async function _render({model, el}) {
    console.debug("[pyjb] Rendering linear genome view.");
    // Resolve relative paths to URLs
    // See: https://ipywidgets.readthedocs.io/en/stable/examples/Widget%20Custom.html#passing-urls
    const resolveUrl = model.widget_manager.resolveUrl.bind(model.widget_manager);
    const seq = await resolveUrlProperties(model.get('assembly'), resolveUrl, URL_KEYS);
    const tracks = await Promise.all(model.get('tracks').map(t => {
	return resolveUrlProperties(t, resolveUrl, URL_KEYS)
    }));
    const state = createViewState({
	assembly: assembly(seq),
	location: model.get('location'),
	tracks: tracks.map(featureTrack),

    });
    const root = createRoot(el);
    const lgv = createElement(JBrowseLinearGenomeView, {viewState: state});
    root.render(lgv);
    return () => {
	root.unmount();
	console.debug("[pyjb] Unmounted LGV component");
    }
}

let render = _render;

if (import.meta.hot) {
    if (!import.meta.hot.data.render) {
	console.log("[pyjb][HMR] Initializing render and contexts");
	import.meta.hot.data.render = _render;
	import.meta.hot.data.contexts = [];
    }

    async function _renderHmr({model, el}) {
	console.debug("[pyjb][HMR] Calling _renderHmr");
	let cleanup = await import.meta.hot.data.render({model, el}) 
	import.meta.hot.data.contexts.push({model, el, cleanup})
	return async () => {
	    // Call the latest available cleanup function for out `el`
	    // Remove ourselves from the active contexts
	    console.debug("[pyjb][HMR] Cleanup and update contexts");
	    let newContexts = [];
	    for (let c of import.meta.hot.data.contexts) {
		if (c.el === el) {
		    await c.cleanup();
		    c.model.off();		    
		} else {
		    newContexts.push(c)
		}
	    }
	    import.meta.hot.data.contexts = newContexts;
	}
    }
    render = _renderHmr;

    async function refresh() {
	// Re-render all recorded widget views
	let contexts = import.meta.hot.data.contexts; 
	console.debug(`[pyjb][HMR] Refreshing ${contexts.length} views`);
	for (let c of contexts) {
	    await c.cleanup();
	    c.model.off();
	    c.cleanup = await import.meta.hot.data.render({el: c.el, model: c.model})
	}
    }
    
    import.meta.hot.accept(async (newModule) => {
	if (!newModule) {
	    console.error("[pyjb][HMR] Syntax error in updated module")
	}
	console.debug("[pyjb][HMR] Received update");
	import.meta.hot.data.render = newModule._render;
	await refresh();
    })
    
}

export default { render }
