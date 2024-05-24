import {
    createViewState,
    JBrowseLinearGenomeView,
} from '@jbrowse/react-linear-genome-view'
import { createElement } from 'react'
import { createRoot } from 'react-dom/client'
import { assembly, featureTrack, URL_KEYS} from './config'
import { resolveUrlProperties } from './utils'

export async function render({model, el}) {
    console.log("Rendering linear genome view.");
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
	tracks: tracks.map(featureTrack)

    });
    const root = createRoot(el);
    const lgv = createElement(JBrowseLinearGenomeView, {viewState: state});
    root.render(lgv);
    return () => {
	console.debug("[pyjb] Cleaning up JBrowseLineargenomeview component");
	root.unmount();
    }
}


export default { render }
