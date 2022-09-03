import Vue from 'vue'
import Vuex from 'vuex'
import { COLOR_SCHEMES, rsrcUrl } from "@/helpers";
import search from './search';
import createDelegatedTasksHandler from "@/store/delegated-tasks";
import { APP_BUILT_DATE, APP_VERSION } from '@/app-helpers';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        colorScheme: 'system',
        maps: new Map(),
        points: new Map(),
        currentMaps: new Map(),
        currentPoint: null,
        focusedPoint: null,
    },
    // set - overwrites value(s)
    // unset - removes value(s)
    // add - appends value(s)
    // toggle - switches between two value (i.e: true and false)
    // mark - one-way toggle (i.e: false to true, subsequent calls don't modify value)
    mutations: {
        setColorScheme(state, scheme) {
            state.colorScheme = scheme;
        },
        addMaps(state, maps) {
            maps.forEach(x => state.maps.set(x.id, x));

            state.maps = new Map(state.maps);
        },
        addPoints(state, points) {
            points.forEach(x => state.points.set(x.id, x))

            state.points = new Map(state.points);
        },
        setCurrentMap(state, map) {
            state.currentMaps.set(map.id, map);

            state.currentMaps = new Map(state.currentMaps);
        },
        setCurrentPoint(state, point) {
            state.currentPoint = point;
        },
        toggleCurrentMaps(state, { map, enabled }) {
            if (enabled) {
                state.currentMaps.set(map.id, map);
            } else {
                state.currentMaps.delete(map.id);
            }

            state.currentMaps = new Map(state.currentMaps);
        },
        setFocusedPoint(state, point) {
            state.focusedPoint = point;
        },
        unsetFocusedPoint(state) {
            state.focusedPoint = null;
        }
    },
    getters: {
        defaultMap(state) {
            for (const el of state.maps.values()) {
                if (el.isDefault === true) {
                    return el;
                }
            }

            return state.maps.values().next().value;
        },
        currentPoint(state) {
            return state.currentPoint;
        },
        anyMapSelected(state) {
            return state.currentMaps.size > 0;
        },
        currentMap(state, getters) {
            return state.currentMaps.values().next().value || getters.defaultMap;
        },
        currentMapsIds(state) {
            return Array.from(state.currentMaps.keys()).map(x => x);
        },
        points(state) {
            return Array.from(state.points.values());
        },
        currentPoints(state, getters) {
            return getters.points.filter(x => getters.currentMapsIds.includes(x.mapId));
        },
        maps(state) {
            return Array.from(state.maps.values());
        },
        point(state) {
            return (id) => state.points.get(id)
        },
        map(state) {
            return (id) => state.maps.get(id)
        },
        pinGroups(_state, getters) {
            return new Set(getters.points.map(x => x.group));
        },
        version() {
            return APP_VERSION;
        },
        builtDate() {
            return APP_BUILT_DATE;
        }
    },
    actions: {
        async fetchPoints(ctx, mapId) {
            if (ctx.getters.points.find(x => x.mapId === mapId)) {
                // already fetched, no need to do that
                return;
            }

            const points = await (async () => {
                const resp = await fetch(rsrcUrl(`/maps/${mapId}/points`));

                return resp.json();
            })();

            ctx.commit('addPoints', points);
            ctx.dispatch('search/extendSearchIndex', points);
        },
        async fetchMaps(ctx) {
            const maps = await (async () => {
                const resp = await fetch(rsrcUrl('/maps'));

                return resp.json();
            })();

            ctx.commit('addMaps', maps);
        }
    },
    modules: {
        search
    },
    plugins: [
        createDelegatedTasksHandler(
            () => new Worker(
                new URL('../web-worker.js', import.meta.url),
                { type: 'module' }
            )
        )
    ]
})
