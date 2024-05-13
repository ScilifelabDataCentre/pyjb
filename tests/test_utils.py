import pytest
from dataclasses import dataclass
from pyjb import _camelize, _camelize_keys, _to_json


@pytest.mark.parametrize("s, e", [
    ("a_b", "aB"),
    ("", ""),
    ("a", "a"),
])
def test_camelize(s, e):
    assert _camelize(s) == e

@pytest.mark.parametrize("d, e", [
    ({"a_b": 1}, {"aB": 1}),
    ({}, {}),
])
def test_camelize_keys(d, e):
    assert _camelize_keys(d) == e


def test_to_json():
    @dataclass
    class C:
        a_b: int = 1
        c: int = 2
    assert _to_json(C()) == {"aB": 1, "c": 2}
