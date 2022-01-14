<template>
  <div>
    <l-control position="topleft">
      <div class="flex gap-1">
        <a
          href="#"
          class="p-2 bg-app hover:outline outline-2 outline-offset-1 outline-app text-white rounded shadow flex flex-cols justify-center"
          @click="menuVisible = !menuVisible"
        >
          <fa-icon
            icon="fa-solid fa-chevron-left"
            size="xl"
            fixed-width
          />
        </a>
        <input
          v-if="menuVisible"
          type="text"
          class="px-2 py-1 border-app border border-2 rounded shadow outline-none focus:ring ring-app hover:outline hover:outline-app outline-offset-1 outline-2 text-lg"
          placeholder="Szukaj pinezki"
        >
      </div>
    </l-control>
    <l-control position="topleft">
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
            <label>
              <input
                type="checkbox"
              >
              {{ map.name }}
            </label>
          </li>
        </ul>
        <div class="text-lg leading-loose divide-y">
          Grupy pinezek
        </div>
        <ul class="my-2 ml-4">
          <li
            v-for="group in pinGroups"
            :key="group"
          >
            <label>
              <input
                type="checkbox"
              >
              {{ group }}
            </label>
          </li>
        </ul>
      </div>
    </l-control>
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import {LControl} from "vue2-leaflet";
export default {
    name: "MapLookup",
    components: {
        LControl
    },
    data: () => ({
        menuVisible: false,
    }),
    computed: {
        ...mapGetters({
            maps: 'maps',
            pinGroups: 'pinGroups'
        }),
    }
}
</script>

<style scoped>

</style>