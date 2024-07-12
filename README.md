# JBrowse Jupyter widgets

## Usage

- Build the JavaScript bundle `pyjb/static/index.js`

```bash
npm run build
```

- Run the example notebooks
```bash
python -m venv --prompt pyjb .venv
source .venv/bin/activate
python -m pip install -e .[dev]
cd examples
jupyter lab
```
