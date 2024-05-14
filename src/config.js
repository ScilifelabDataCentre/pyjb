/* The functions in this module could in principle be shared with @jbrowse/cli: they
take a flat dictionary of options and return configuration objects.
In the case of @jbrowse/cli, arguments come from the command line,
and in pyjb context they come from the widget model. */

const URL_KEYS = new Set([
    // Assemblies
    'sequence',
    'faiLocation',
    'gziLocation',
    'refNameAliases',
    // Tracks
    'track',
    'indexFile'
])


function assembly({sequence, name, faiLocation, gziLocation, refNameAliases, aliases}) {
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


function trackAdapter({adapterType, track, indexFile}) {
    if (adapterType == "Gff3TabixAdapter") {
	return {
	    type: 'Gff3tabixadapter',
	    gffGzLocation: {uri: track},
	    indexFile: {uri: indexFile}
	}
    }
    if (adapterType == "BedAdapter") {
	return {
	    type: 'BedAdapter',
	    bedLocation: {uri: track}
	}
    }
    throw new Error(`Unsupported adapter type: ${adapterType}`)
}


function featureTrack({track, name, assemblyNames, type, adapterType, indexFile}) {
    return {
	name,
	type,
	assemblyNames,
	trackId: name.toLowerCase(),
	adapter: trackAdapter({adapterType, track, indexFile})
    }
}


export { featureTrack, assembly }
