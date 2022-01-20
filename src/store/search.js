export default {
    namespaced: true,
    state: () => ({
        searchResults: [],
        indexInitialized: false,
        query: '',
        performingSearch: false,
    }),
    mutations: {
        markIndexInitialized(state) {
            state.indexInitialized = true;
        },
        setSearchResults(state, results) {
            state.searchResults = results;
        },
        setQuery(state, value) {
            state.query = value;
        },
        unsetSearchResults(state) {
            state.searchResults = [];
        },
        togglePerformingSearch(state, enabled) {
            state.performingSearch = !!enabled;
        }
    },
    getters: {
        hasQuery: (state) => state.query.length > 0,
        hasSearchResults: (state) => state.searchResults.length > 0,
    },
    actions: {
        initSearchIndex(ctx) {
            ctx.dispatch('extendSearchIndex', [ctx.rootGetters.points])
        },
        extendSearchIndex(ctx, points) {
            this.delegateTask('extendSearchIndex', [points])
                .then(() => {
                    ctx.commit('markIndexInitialized');
                });
        },
        doSearch(ctx) {
            ctx.commit('togglePerformingSearch', true);
            this.delegateTask('doSearch', [ctx.state.query])
                .then((results) => {
                    ctx.commit('setSearchResults', results);
                    ctx.commit('togglePerformingSearch', false);
                })
        }
    }
}
