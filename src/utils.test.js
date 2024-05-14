import { expect, test } from 'vitest'
import { promiseAllProperties, resolveUrlProperties } from './utils'

test("Returns object with promised values resolved", async () => {
    const obj = {"url": Promise.resolve(1)};
    const res = await promiseAllProperties(obj);
    const exp = {"url": 1};
    expect(res).toEqual(exp);
})


test("Returns object with URL values resolved", async () => {
    const keys = new Set(["uri", "url"]);
    const obj = {"uri": "relative/path", "foo": 1, "url": null}
    const resolveUrl = (path) => Promise.resolve("resolved/" + path)
    const res = await resolveUrlProperties(obj, resolveUrl, keys)
    const exp = {"uri": "resolved/relative/path", "foo": 1, "url": null}
    expect(res).toEqual(exp)
})
