import Vue from 'vue'
import Vuex from 'vuex'
import {COLOR_SCHEMES} from "@/helpers";
import search from './search';
import createDelegatedTasksHandler from "@/store/delegated-tasks";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        colorSchema: 'system',
        maps: new Map(),
        points: new Map(),
        currentMaps: new Set(),
        currentPoint: null,
    },
    // set - overwrites value(s)
    // add - appends value(s)
    // toggle - switches between two value (i.e: true and false)
    // mark - toggles from one value to another ALWAYS (i.e: false to true, subsequent calls don't modify value)
    mutations: {
        setColorSchema(state, schema) {
            if (!COLOR_SCHEMES.contains(schema)) {
                schema = COLOR_SCHEMES[0];
            }

            state.colorSchema = schema;
        },
        addMaps(state, maps) {
            maps.forEach(x => state.maps.set(x.id + '', x))
        },
        addPoints(state, points) {
            points.forEach(x => state.points.set(x.id + '', x))
        },
        setCurrentMap(state, map) {
            state.currentMaps.add(map);
        },
        setCurrentPoint(state, point) {
            state.currentPoint = point;
        },
        toggleCurrentMaps(state, {map, enabled}) {
            if (enabled) {
                state.currentMaps.add(map);
            } else {
                state.currentMaps.delete(map);
            }
        },
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
        currentMap(state, getters) {
            return state.currentMaps.values().next().value || getters.defaultMap;
        },
        currentMaps(state, getters) {
            if (state.currentMaps.size === 0) {
                return new Set([getters.defaultMap]);
            }

            return state.currentMaps;
        },
        currentMapsIds(state, getters) {
            return Array.from(getters.currentMaps.values()).map(x => x.id + '');
        },
        points(state) {
            return Array.from(state.points.values());
        },
        maps(state) {
            return Array.from(state.maps.values());
        },
        point(state) {
            return (id) => state.points.get(id + '')
        },
        map(state) {
            return (id) => state.maps.get(id + '')
        },
        pinGroups(state, getters) {
            return new Set(getters.points.map(x => x.group));
        },
    },
    actions: {},
    modules: {
        search
    },
    plugins: [
        createDelegatedTasksHandler(
            () => new Worker(new URL('@/web-worker.js', import.meta.url))
        )
    ]
})
