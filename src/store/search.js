export default {
    namespaced: true,
    state: () => ({
        searchResults: [],
        indexInitialized: false,
        query: '',
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
        }
    },
    getters: {
        hasQuery: (state) => state.query.length > 0,
        hasSearchResults: (state) => state.searchResults.length > 0,
    },
    actions: {
        initSearchIndex(ctx) {
            this.delegateTask('initSearchIndex', [ctx.rootGetters.points])
                .then(() => {
                    ctx.commit('markIndexInitialized');
                });
        },
        doSearch(ctx) {
            this.delegateTask('doSearch', [ctx.state.query])
                .then((results) => {
                    ctx.commit('setSearchResults', results);
                })
        }
    }
}
