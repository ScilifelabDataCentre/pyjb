from pyjb import Gff, Bam, Fasta
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

def test_bam():
    a = Fasta("genomic.fna.gz", name="hg38")
    t = Bam("genomic.bam", name="Alignments", assembly=a)
    assert asdict(t) == {
        "track": "genomic.bam",
        "name": "Alignments",
        "assembly_names": ["hg38"],
        "type": "AlignmentsTrack",
        "adapter_type": "BamAdapter",
        "index_file": "genomic.bam.bai",
        "index_type": "BAI"
    }
    
