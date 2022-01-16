import Fuse from 'fuse.js';

self.addEventListener('message', async (msg) => {
    const {type, args, taskId} = msg.data;

    if (typeof self[type] === 'undefined') {
        throw new TypeError(`handler for delegate action [${type}] missing`);
    }

    const data = await self[type](args, {type, taskId});

    self.postMessage({
        data: Array.isArray(data) ? data : [data].filter(x => x),
        taskId
    });
});

// eslint-disable-next-line no-unused-vars
self.initSearchIndex = ([points]) => {
    const options = {
        keys: ['title', 'excerpt', 'group', 'tags'],
        minMatchCharLength: 2
    };

    self.pointsSearchIndex = Fuse.createIndex(options.keys, points);
    self.pointsSearch = new Fuse(points, options, self.pointsSearchIndex);
}

self.doSearch = ([query]) => {
    const results = self.pointsSearch.search(query, {
        limit: 5
    });

    return results.map(x => x.item);
}