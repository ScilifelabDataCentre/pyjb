if (!import.meta.hot.data.render) {
    console.log("[pyjb][HMR] Initializing render and contexts");
    import.meta.hot.data.render = _render;
    import.meta.hot.data.contexts = [];
}

async function render({model, el}) {
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
