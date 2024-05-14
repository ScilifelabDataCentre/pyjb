import { test, expect } from 'vitest'
import { trackAdapter } from './config'

test("Generates correct adapter configuration", () => {
    let [adapterType, track, indexFile] = ["Gff3TabixAdapter", "genomic.gff.gz", "index.tbi"]
    expect(trackAdapter({adapterType, track, indexFile})).toEqual({
	type: 'Gff3TabixAdapter',
	gffGzLocation: {uri: "genomic.gff.gz"},
	index: {
	    location: {uri: "index.tbi"}
	}
    });
})
