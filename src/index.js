import {
  createViewState,
  JBrowseLinearGenomeView,
} from '@jbrowse/react-linear-genome-view'

import React from 'react'

import ReactDOM from 'react-dom'


const assembly = {
  name: 'GRCh38',
  sequence: {
    type: 'ReferenceSequenceTrack',
    trackId: 'GRCh38-ReferenceSequenceTrack',
    adapter: {
      type: 'BgzipFastaAdapter',
      fastaLocation: {
        uri: 'https://s3.amazonaws.com/jbrowse.org/genomes/GRCh38/fasta/GRCh38.fa.gz',
        locationType: 'UriLocation',
      },
      faiLocation: {
        uri: 'https://s3.amazonaws.com/jbrowse.org/genomes/GRCh38/fasta/GRCh38.fa.gz.fai',
        locationType: 'UriLocation',
      },
      gziLocation: {
        uri: 'https://s3.amazonaws.com/jbrowse.org/genomes/GRCh38/fasta/GRCh38.fa.gz.gzi',
        locationType: 'UriLocation',
      },
    },
  },
  aliases: ['hg38'],
  refNameAliases: {
    adapter: {
      type: 'RefNameAliasAdapter',
      location: {
        uri: 'https://s3.amazonaws.com/jbrowse.org/genomes/GRCh38/hg38_aliases.txt',
        locationType: 'UriLocation',
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


function render({model, el}) {
    console.log("Rendering linear genome view.");
    const state = createViewState({
	assembly,
	location: '10:29,838,737..29,838,819',
	defaultSession
    });
    
    ReactDOM.render(
	React.createElement(JBrowseLinearGenomeView, { viewState: state }),
	el
    )
}


export default {render}
