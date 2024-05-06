import anywidget
import traitlets
from pathlib import Path

class LGVWidget(anywidget.AnyWidget):
    _esm = Path(__file__).parent / 'static' / 'index.mjs'
    track = traitlets.Unicode().tag(sync=True)

