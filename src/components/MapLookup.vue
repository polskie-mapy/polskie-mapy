<template>
  <div>
    <l-control
      position="topleft"
      class="lg:w-80 w-full"
    >
      <div class="flex gap-1">
        <button
          class="p-2 bg-app hover:outline outline-2 outline-offset-1 outline-app text-white rounded shadow flex flex-cols justify-center"
          @click="menuVisible = !menuVisible"
        >
          <fa-icon
            :icon="toggleIcon"
            size="xl"
            fixed-width
          />
        </button>
        <div
          v-if="menuVisible"
          class="border-app border border-2 rounded shadow outline-none ring-app hover:outline hover:outline-app outline-offset-1 outline-2 text-lg w-full flex"
          :class="{'border-gray-600 hover:outline-gray-600': !searchIndexInitialized, 'hover:outline-app ring-app focus:ring': searchIndexInitialized}"
        >
          <input
            :disabled="!searchIndexInitialized"
            type="text"
            class="px-2 py-1 w-full outline-none border-none disabled:bg-white disabled:cursor-not-allowed"
            placeholder="Szukaj pinezki (min. 2 znaki)"
            :value="searchQuery"
            @input="setSearchQuery"
          >
          <div
            v-if="performingSearch || !searchIndexInitialized"
            class="inline px-2 bg-white flex text-app"
          >
            <fa-icon
              class="self-center"
              icon="fa-solid fa-sync"
              spin
            />
          </div>
        </div>
      </div>
    </l-control>
    <l-control
      position="topleft"
      class="lg:w-80 w-full"
    >
      <div
        v-if="menuVisible && hasSearchResults && hasSearchQuery"
        class="flex flex-col bg-white border-app border-2 rounded shadow divide-y mb-3"
      >
        <router-link
          v-for="item in searchResults"
          :key="item.id"
          :to="{ name: 'PointDetails', params: { pointId: item.id, mapId: item.mapId }}"
          class="py-2 px-4 flex gap-1 hover:bg-app hover:text-white border-transparent hover:border-white border last:mb-px"
          :title="item.title"
        >
          <fa-icon
            :icon="item.icon | iconCodeToIconName"
            fixed-width
            class="self-center"
          />
          <span class="text-ellipsis break-all w-full whitespace-nowrap overflow-x-hidden">{{ item.title }}</span>
        </router-link>
      </div>
      <div
        v-else-if="hasSearchQuery && !hasSearchResults && !performingSearch"
        class="flex flex-col bg-white border-app border-2 rounded shadow divide-y py-2 px-4 mb-3"
      >
        <p>nie znaleziono wyników :&lt;</p>
      </div>

      <div
        v-if="menuVisible"
        class="py-2 px-4 bg-white border-app border-2 rounded shadow mb-4"
      >
        <div class="text-lg leading-loose divide-y">
          Wyświetlane mapy
        </div>
        <ul class="my-2 ml-4">
          <li
            v-for="map in maps"
            :key="map.id"
          >
            <MapConfig :map="map" />
          </li>
        </ul>
      </div>
    </l-control>
  </div>
</template>

<script>
import {debounce} from "lodash";
import {mapGetters, mapState} from "vuex";
import {LControl} from "vue2-leaflet";
import MapConfig from "@/components/MapConfig";

export default {
    name: "MapLookup",
    components: {
        MapConfig,
        LControl
    },
    data: () => ({
        menuVisible: true,
        searchDebouncer: Function,
    }),
    computed: {
        toggleIcon() {
            return this.menuVisible
                ? 'fa-solid fa-chevron-left'
                : 'fa-solid fa-chevron-right';
        },
        ...mapState({
            currentMaps: 'currentMaps'
        }),
        ...mapGetters({
            maps: 'maps',
            pinGroups: 'pinGroups',
        }),
        ...mapGetters('search', {
            hasSearchResults: 'hasSearchResults',
            hasSearchQuery: 'hasQuery'
        }),
        ...mapState('search', {
            searchQuery: (state) => state.query,
            searchIndexInitialized: (state) => state.indexInitialized,
            searchResults: (state) => state.searchResults,
            performingSearch: (state) => state.performingSearch,

        }),
    },
    mounted() {
        this.$store.dispatch('search/initSearchIndex');

        this.searchDebouncer = debounce(() => {
            if (this.searchQuery.length > 1) {
                this.$store.dispatch('search/doSearch');
            }
        }, 250);
    },
    methods: {
        setSearchQuery(ev) {
            this.$store.commit('search/setQuery', ev.target.value);

            if (!this.hasSearchQuery) {
                this.$store.commit('search/unsetSearchResults');
            } else {
                this.searchDebouncer();
            }
        }
    }
}
</script>

<style scoped>

</style>