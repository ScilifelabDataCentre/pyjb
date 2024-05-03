import anywidget
from pathlib import Path

class LGVWidget(anywidget.AnyWidget):
    _esm = Path(__file__).parent / 'static' / 'index.mjs'
    

