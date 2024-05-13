import {
    createViewState,
    JBrowseLinearGenomeView,
} from '@jbrowse/react-linear-genome-view';

import { createElement } from 'react';

import { createRoot } from 'react-dom/client';

const defaultSession = {
    name: 'Default',
    view: {
	id: 'linearGenomeView',
	type: 'LinearGenomeView',
	tracks: [
	    {
		type: 'ReferenceSequenceTrack',
		configuration: 'GRCh38-ReferenceSequenceTrack',
		displays: [
		    {
			type: 'LinearReferenceSequenceDisplay',
			configuration: 'GRCh38-ReferenceSequenceTrack-LinearReferenceSequenceDisplay',
		    },
		],
	    }
	]
    }
};


// The following two functions could be shared with @jbrowse/cli: they
// take a flat dictionary of options and return configuration objects.
// In the case of @jbrowse/cli, arguments come from the command line,
// and in pyjb context they come from the widget model.
async function assembly({sequence, name, faiLocation, gziLocation, refNameAliases, aliases}, resolver) {
    const locations = [sequence, faiLocation, gziLocation, refNameAliases];
    [sequence, faiLocation, gziLocation, refNameAliases] = await Promise.all(
	locations.map(p => resolver.resolveUrl(p))
    );
    return {
	name,
	sequence: {
	    type: 'ReferenceSequenceTrack',
	    trackId: `${name}-ReferenceSequenceTrack`,
	    adapter: {
		type: 'BgzipFastaAdapter',
		fastaLocation: {uri: sequence},
		faiLocation: {uri: faiLocation},
		gziLocation: {uri: gziLocation},
	    },
	},
	aliases,
	refNameAliases: {
	    adapter: {
		type: 'RefNameAliasAdapter',
		location: {
		    uri: refNameAliases,
		},
	    },
	},
    }    
}

function track({uri, name, assembly}) {
    return {
	name,
	type: "FeatureTrack",
	trackId: name.toLowerCase(),
	assemblyNames: [assembly],
	adapter: {
	    type: 'BedAdapter',
	    bedLocation: {uri}
	}
    }
}


async function render({model, el}) {
    console.log("Rendering linear genome view.");
    // Convert relative paths to URLs
    // See: https://ipywidgets.readthedocs.io/en/stable/examples/Widget%20Custom.html#passing-urls
    const asm = model.get('assembly');
    const trackUrl = await model.widget_manager.resolveUrl(model.get('track'));

    const state = createViewState({
	assembly: await assembly(asm, model.widget_manager),
	location: '10:29,838,758..29,838,798',
	tracks: [
	    track({
		uri: trackUrl,
		name: 'Minibed',
		assembly: "GRCh38"
	    })
	],
	defaultSession
    });
    const root = createRoot(el);
    const lgv = createElement(JBrowseLinearGenomeView, { viewState: state });
    root.render(lgv);
}


export default {render}
