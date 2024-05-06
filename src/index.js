import {
    createViewState,
    JBrowseLinearGenomeView,
} from 'https://esm.sh/@jbrowse/react-linear-genome-view?bundle-deps'

import { createElement } from 'https://esm.sh/react'

import { createRoot } from 'https://esm.sh/react-dom/client';

const assembly = {
    name: 'GRCh38',
    sequence: {
	type: 'ReferenceSequenceTrack',
	trackId: 'GRCh38-ReferenceSequenceTrack',
	adapter: {
	    type: 'BgzipFastaAdapter',
	    fastaLocation: {
		uri: 'https://s3.amazonaws.com/jbrowse.org/genomes/GRCh38/fasta/GRCh38.fa.gz',
	    },
	    faiLocation: {
		uri: 'https://s3.amazonaws.com/jbrowse.org/genomes/GRCh38/fasta/GRCh38.fa.gz.fai',
	    },
	    gziLocation: {
		uri: 'https://s3.amazonaws.com/jbrowse.org/genomes/GRCh38/fasta/GRCh38.fa.gz.gzi',
	    },
	},
    },
    aliases: ['hg38'],
    refNameAliases: {
	adapter: {
	    type: 'RefNameAliasAdapter',
	    location: {
		uri: 'https://s3.amazonaws.com/jbrowse.org/genomes/GRCh38/hg38_aliases.txt',
	    },
	},
    },
};


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


function bedTrack(name, path) {
    return {
	name,
	type: "FeatureTrack",
	trackId: name.toLowerCase(),
	adapter: {
	    type: 'BedAdapter',
	    bedLocation: {uri: path}
	}
    }
}

function render({model, el}) {
    console.log("Rendering linear genome view.");
    const bedPath = model.get('track');
    model.widget_manager.resolveUrl(bedPath).then(bedUrl => {
	const state = createViewState({
	    assembly,
	    location: '10:29,838,758..29,838,798',
	    tracks: [bedTrack('Minibed', bedUrl)],
	    defaultSession
	});
	const root = createRoot(el);
	const lgv = createElement(JBrowseLinearGenomeView, { viewState: state });
	root.render(lgv);
    });
}


export default {render}
