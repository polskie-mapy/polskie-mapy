import Fuse from 'fuse.js';

function captureException(error) {
    self.postMessage({
        type: 'error',
        error
    });
}

self.callbacks = {}

self.addEventListener('message', async (msg) => {
    const {type, args, taskId} = msg.data;

    if (typeof self.callbacks[type] === 'undefined') {
        throw new TypeError(`handler for delegate action [${type}] missing`);
    }

    const data = await self.callbacks[type](args);

    self.postMessage({
        type: 'data',
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
        self.pointsIndexedMaps = [points[0].mapId];
    } else if (!self.pointsIndexedMaps.includes(points[0].mapId)) {
        self.pointsIndexedMaps.push(points[0].mapId);
        points.forEach(x => self.pointsSearch.add(x));
    }
}

self.callbacks.doSearch = async ([query]) => {
    async function geocode(query) {
        const url = new URL('/geocode', import.meta.env.VITE_GEOCODING_API_URL);
        url.searchParams.set('query', query);
        try {
            const response = await fetch(url);
            const data = await response.json();
            
            return data.map((item) => {
                return {
                    id: String(item.longitude) + String(item.latitude),
                    title: item.fullName,
                    type: 'map',
                    coords: [item.latitude, item.longitude],
                }
            })
        } catch (ex) {
            captureException(ex);
            return [];
        }
    }
    
    async function places(query) {
        const results = self.pointsSearch.search(query, {
            limit: 5
        });
        
        return Promise.resolve(
            results.map(x => ({...x.item, type: 'point'}))
        );
    }
    
    const results = await Promise.all([
        geocode(query),
        places(query)
    ]);
    
    return results.flat(1);
}
