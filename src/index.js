import {
    createViewState,
    JBrowseLinearGenomeView,
} from 'https://esm.sh/@jbrowse/react-linear-genome-view?bundle-deps'

import { createElement } from 'https://esm.sh/react'

import { createRoot } from 'https://esm.sh/react-dom/client';

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

const hg38Aliases = 'https://s3.amazonaws.com/jbrowse.org/genomes/GRCh38/hg38_aliases.txt';


// The following two functions could be shared with @jbrowse/cli: they
// take a flat dictionary of options and return configuration objects.
// In the case of @jbrowse/cli, arguments come from the command line,
// and in pyjb context they come from the widget model.
function assembly({uri, name, aliases, refNameAliases}) {
    return {
	name,
	sequence: {
	    type: 'ReferenceSequenceTrack',
	    trackId: `${name}-ReferenceSequenceTrack`,
	    adapter: {
		type: 'BgzipFastaAdapter',
		fastaLocation: {uri},
		faiLocation: {
		    uri: `${uri}.fai`,
		},
		gziLocation: {
		    uri: `${uri}.gzi`,
		},
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
    const [trackUrl, asmUrl] = await Promise.all([
	model.widget_manager.resolveUrl(model.get('track')),
	model.widget_manager.resolveUrl(model.get('assembly'))
    ]);
    const state = createViewState({
	assembly: assembly({
	    uri: asmUrl,
	    name: "GRCh38",
	    aliases: ["hg38"],
	    refNameAliases: hg38Aliases
	}),
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
