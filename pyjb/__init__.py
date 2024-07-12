import os
import anywidget
import traitlets
import re
from dataclasses import dataclass, field, asdict, InitVar

from pathlib import Path


UNDERSCORE_RE = re.compile(r"_[a-z]")


def _camelize(s):
    return UNDERSCORE_RE.sub(lambda match: match.group()[-1].upper(), s)


def _camelize_keys(d):
    return {_camelize(k): v for k, v in d.items()}


def _to_json(dc):
    return _camelize_keys(asdict(dc))


@dataclass
class Fasta:
    sequence: str
    name: str
    type: str = "bgzipFasta"
    ref_name_aliases: str | None = None
    fai_location: str | None = None
    gzi_location: str | None = None
    aliases: list = field(default_factory=list)

    def __post_init__(self):
        if self.fai_location is None:
            self.fai_location = f"{self.sequence}.fai"
        if self.gzi_location is None:
            self.gzi_location = f"{self.sequence}.gzi"


@dataclass
class BaseTrack:
    track: str
    name: str
    assembly: InitVar[Fasta]
    assembly_names: list[str] = field(default_factory=list, init=False)
    index_file: str = None

    def __post_init__(self, assembly):
        self.assembly_names = [assembly.name]


@dataclass
class Gff(BaseTrack):
    type: str = field(default="FeatureTrack", init=False)
    adapter_type: str = "Gff3TabixAdapter"

    def __post_init__(self, assembly):
        super().__post_init__(assembly)
        if self.index_file is None:
            self.index_file = f"{self.track}.tbi"


@dataclass
class Bam(BaseTrack):
    type: str = field(default="AlignmentsTrack", init=False)
    adapter_type: str = "BamAdapter"
    index_type: str = "BAI"

    def __post_init__(self, assembly):
        super().__post_init__(assembly)
        if self.index_file is None:
            self.index_file = f"{self.track}.{self.index_type.lower()}"


if os.environ.get("PYJB_DEV", False):
    _ESM = "http://localhost:5173/src/index.js?anywidget"
else:
    _ESM = Path(__file__).parent / "static" / "index.js"


class LGVWidget(anywidget.AnyWidget):
    _esm = _ESM
    location = traitlets.Unicode().tag(sync=True)
    assembly = traitlets.Instance(Fasta).tag(
        sync=True, to_json=lambda dc, _: _to_json(dc)
    )
    tracks = traitlets.List(traitlets.Instance(BaseTrack)).tag(
        sync=True, to_json=lambda tl, _: map(_to_json, tl)
    )
