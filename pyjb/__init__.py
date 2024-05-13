import anywidget
import traitlets
import re

from dataclasses import dataclass, field, asdict

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
    fai_location: str | None = None
    gzi_location: str | None = None
    ref_name_aliases: list = field(default_factory=list)
    aliases: list = field(default_factory=list)

    def __post_init__(self):
        if self.fai_location is None:
            self.fai_location = f"{self.sequence}.fai" 
        if self.gzi_location is None:
            self.gzi_location = f"{self.sequence}.gzi"



class LGVWidget(anywidget.AnyWidget):
    _esm = Path(__file__).parent / 'static' / 'index.mjs'
    assembly = traitlets.Instance(Fasta).tag(sync=True, to_json=lambda dc, _: _to_json(dc))
    track = traitlets.Unicode().tag(sync=True)

    
