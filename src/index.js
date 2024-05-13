import {
    createViewState,
    JBrowseLinearGenomeView,
} from '@jbrowse/react-linear-genome-view';

import { createElement } from 'react';

import { createRoot } from 'react-dom/client';

import { assembly, featureTrack} from './config';


async function render({model, el}) {
    console.log("Rendering linear genome view.");
    // Convert relative paths to URLs
    // See: https://ipywidgets.readthedocs.io/en/stable/examples/Widget%20Custom.html#passing-urls
    const resolveUrl = model.widget_manager.resolveUrl.bind(model.widget_manager);
    const asm = model.get('assembly');
    const tracks = model.get('tracks');

    const state = createViewState({
	assembly: await assembly(asm, resolveUrl),
	location: '10:29,838,758..29,838,798',
	tracks: await Promise.all([
	    tracks.map(t => featureTrack(t, resolveUrl))
	])
    });
    const root = createRoot(el);
    const lgv = createElement(JBrowseLinearGenomeView, {viewState: state});
    root.render(lgv);
}


export default {render}
