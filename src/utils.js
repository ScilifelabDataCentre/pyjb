/* Await resolution of all promised values */
async function promiseAllProperties(obj) {
    const keys = [], promises = [];
    for (const [k, p] in Object.entries(obj)) {
	keys.push(k);
	promises.push(p);
    }
    const values = await Promise.all(promises);
    const result = {};
    for (const [idx, k] in keys.entries()) {
	result[k] = values[idx];
    }
    return result
}

/* Resolve object's URL values */
function resolveUrlProperties(obj, resolveUrl, keys) {
    const urlPromises = {};
    for (const k in keys) {
	if (k in obj) {
	    urlPromises[k] = resolveUrl(obj[k]);
	}
    }
    const urls = await promiseAllProperties(urlPromises);
    return Object.assign(obj, urls)
}

