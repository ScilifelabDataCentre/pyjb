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
    const config = {
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
	aliases
    }
    if (refNameAliases !== null) {
	config.refNameAliases = {
	    adapter: {
		type: 'RefNameAliasAdapter',
		location: {
		    uri: refNameAliases,
		}
	    }
	}
    }
    return config
}

const GFF_TABIX_ADAPTER = "Gff3TabixAdapter",
      BED_ADAPTER = "BedAdapter";

function trackAdapter({adapterType, track, indexFile}) {
    if (adapterType == GFF_TABIX_ADAPTER) {
	return {
	    type: GFF_TABIX_ADAPTER,
	    gffGzLocation: {uri: track},
	    index: {
		location: {uri: indexFile}
	    }
	}
    }
    if (adapterType == BED_ADAPTER) {
	return {
	    type: BED_ADAPTER,
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
	trackId: name.replace(/\s+/g, '-').toLowerCase(),
	adapter: trackAdapter({adapterType, track, indexFile})
    }
}


export { featureTrack, assembly, trackAdapter, URL_KEYS }
