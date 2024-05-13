from pyjb import Gff, Fasta
from dataclasses import asdict

def test_gff():
    a = Fasta("genomic.fna.gz", "hg38")
    t = Gff("genomic.gff.gz", "annotations", a)
    assert asdict(t) == {
        "track": "genomic.gff.gz",
        "name": "annotations",
        "assembly_names": ["hg38"],
        "type": "FeatureTrack",
        "adapter_type": "Gff3TabixAdapter",
        "index_file": "genomic.gff.gz.tbi"
    }
