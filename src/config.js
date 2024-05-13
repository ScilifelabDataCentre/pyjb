// The following two functions could be shared with @jbrowse/cli: they
// take a flat dictionary of options and return configuration objects.
// In the case of @jbrowse/cli, arguments come from the command line,
// and in pyjb context they come from the widget model.
async function assembly({sequence, name, faiLocation, gziLocation, refNameAliases, aliases}, resolveUrl) {
    const locations = [sequence, faiLocation, gziLocation, refNameAliases];
    [sequence, faiLocation, gziLocation, refNameAliases] = await Promise.all(locations.map(resolveUrl));
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


async function featureTrack({track, name, assemblyNames, type, adapterType, indexFile}, resolveUrl) {
    const [track, indexFile] = await Promise.all([track, indexFile].map(resolveUrl));
    return {
	name,
	type,
	assemblyNames,
	trackId: name.toLowerCase(),
	adapter: trackAdapter({adapterType, track, indexFile})
    }
}
