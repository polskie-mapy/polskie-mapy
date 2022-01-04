import Vue from 'vue'
import Vuex from 'vuex'
import {COLOR_SCHEMES} from "../helpers";

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        colorSchema: 'system',
    },
    mutations: {
        setColorSchema(state, schema) {
            if (!COLOR_SCHEMES.contains(schema)) {
                schema = COLOR_SCHEMES[0];
            }

            state.colorSchema = schema;
        }
    },
    actions: {},
    modules: {}
})
