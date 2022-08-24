import Fuse from 'fuse.js';

self.callbacks = {}

self.addEventListener('message', async (msg) => {
    const {type, args, taskId} = msg.data;

    if (typeof self.callbacks[type] === 'undefined') {
        throw new TypeError(`handler for delegate action [${type}] missing`);
    }

    const data = await self.callbacks[type](args);

    self.postMessage({
        data: Array.isArray(data) ? data : [data].filter(x => x),
        taskId
    });
});

// eslint-disable-next-line no-unused-vars
self.callbacks.extendSearchIndex = ([points]) => {
    const options = {
        keys: ['title', 'excerpt', 'group', 'tags'],
        minMatchCharLength: 2
    };

    if (!self.pointsSearchIndex) {
        self.pointsSearchIndex = Fuse.createIndex(options.keys, points);
        self.pointsSearch = new Fuse(points, options, self.pointsSearchIndex);
        self.pointsIndexedMaps = [points[0].mapId + ''];
    } else if (!self.pointsIndexedMaps.includes(points[0].mapId + '')) {
        self.pointsIndexedMaps.push(points[0].mapId + '');
        points.forEach(x => self.pointsSearch.add(x));
    }
}

self.callbacks.doSearch = ([query]) => {
    const results = self.pointsSearch.search(query, {
        limit: 5
    });

    return results.map(x => x.item);
}