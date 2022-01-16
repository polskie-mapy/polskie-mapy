<template>
  <div>
    <l-control
      position="topleft"
      class="w-80"
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
        <input
          v-if="menuVisible"
          type="text"
          class="px-2 py-1 border-app border border-2 rounded shadow outline-none focus:ring ring-app hover:outline hover:outline-app outline-offset-1 outline-2 text-lg w-full"
          placeholder="Szukaj pinezki"
        >
      </div>
    </l-control>
    <l-control
      position="topleft"
      class="w-80"
    >
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
import {mapGetters} from "vuex";
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
    }),
    computed: {
        toggleIcon() {
            return this.menuVisible
                ? 'fa-solid fa-chevron-left'
                : 'fa-solid fa-chevron-right';
        },
        ...mapGetters({
            maps: 'maps',
            pinGroups: 'pinGroups',
            currentMaps: 'currentMaps'
        }),
    },
    methods: {

    }
}
</script>

<style scoped>

</style>