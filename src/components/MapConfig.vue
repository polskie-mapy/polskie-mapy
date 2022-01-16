<template>
  <div>
    <div class="flex justify-between">
      <div>
        <input
          :id="`ml-map-${map.id}`"
          :checked="isInCurrentMaps"
          type="checkbox"
          class="appearance-none h-4 w-4 border border-gray-300 rounded bg-white checked:bg-app checked:border-app focus:outline-none align-top mr-2 cursor-pointer"
          @input="toggleCurrentMaps"
        >
        <label
          class="inline-block select-none cursor-pointer"
          :for="`ml-map-${map.id}`"
        >
          {{ map.name }}
        </label>
      </div>
      <button
        v-if="false"
        class="text-gray-600"
        @click="toggle"
      >
        <fa-icon :icon="togglerIcon" />
      </button>
    </div>

    <div
      v-if="expanded"
      class="border-l border-r border-gray-200 px-1"
    >
      <p class="text-gray-600 font-bold my-1">
        Grupy pinezek
      </p>
      <ul class="ml-2">
        <li
          v-for="(group, i) in pinGroups"
          :key="group"
        >
          <input
            :id="`ml-map-${map.id}-group-${i}`"
            type="checkbox"
            class="appearance-none h-4 w-4 border border-gray-300 rounded bg-white checked:bg-app checked:border-app focus:outline-none align-top mr-2 cursor-pointer"
          >
          <label
            class="inline-block select-none cursor-pointer"
            :for="`ml-map-${map.id}-group-${i}`"
          >
            {{ group }}
          </label>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import {mapGetters, mapState} from "vuex";

export default {
    name: "MapConfig",
    props: {
        map: {
            type: Object,
            required: true
        }
    },
    data: () => ({
        expanded: false,
    }),
    computed: {
        togglerIcon() {
            return this.expanded
                ? 'fa-solid fa-chevron-up'
                : 'fa-solid fa-chevron-down';
        },
        ...mapState({
            currentMaps: 'currentMaps'
        }),
        ...mapGetters({
            maps: 'maps',
            points: 'points',
            currentMapsIds: 'currentMapsIds',
        }),
        isInCurrentMaps() {
            return this.currentMaps.has(this.map.id + '');
        },
        pinGroups() {
            return new Set(
                this.points.filter(x => {
                    return this.currentMapsIds.includes(x.mapId + '');
                }).map(x => x.group)
            );
        }
    },
    methods: {
        toggleCurrentMaps(ev) {
            this.$store.commit('toggleCurrentMaps', {map: this.map, enabled: ev.target.checked});
        },
        toggle() {
            this.expanded = !this.expanded;
        }
    },
}
</script>

<style scoped>

</style>