import Vue from 'vue'
import Vuex from 'vuex'
import {COLOR_SCHEMES} from "@/helpers";

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        colorSchema: 'system',
        maps: new Map(),
        points: new Map(),
        currentMap: null,
        currentPoint: null,
    },
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
            state.currentMap = map;
        },
        setCurrentPoint(state, point) {
            state.currentPoint = point;
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
        currentMap(state, getters) {
            return state.currentMap || getters.defaultMap;
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
    modules: {}
})
