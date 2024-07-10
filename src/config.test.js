import { test, expect } from 'vitest'
import { trackAdapter } from './config'

test("Generates correct GFF adapter configuration", () => {
    let [adapterType, track, indexFile] = ["Gff3TabixAdapter", "genomic.gff.gz", "index.tbi"]
    expect(trackAdapter({adapterType, track, indexFile})).toEqual({
	type: 'Gff3TabixAdapter',
	gffGzLocation: {uri: "genomic.gff.gz"},
	index: {
	    location: {uri: "index.tbi"}
	}
    });
})


test("Generates correct BAM adapter configuration", () => {
    let [adapterType, track, indexFile, indexType] = ["BamAdapter", "file.bam", "file.bam.csi", "CSI"],
	expected = {
	    "type": "BamAdapter",
	    "bamLocation": {
		"uri": "file.bam"
	    },
	    "index": {
		"indexType": "CSI",
		"location": {
		    "uri": "file.bam.csi"
		}
	    }
	};
    expect(trackAdapter({adapterType, track, indexFile, indexType})).toEqual(expected);
})
