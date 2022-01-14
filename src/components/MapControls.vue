<template>
  <div class="grid grid-rows-2 grid-cols-1 shadow">
    <a
      href="#"
      class="p-2 bg-app rounded-b-none hover:outline outline-2 outline-offset-1 outline-app text-white rounded flex flex-cols justify-center"
      @click="zoomIn"
    >
      <fa-icon
        icon="fa-solid fa-plus"
        fixed-size
      />
    </a>
    <a
      href="#"
      class="p-2 bg-app hover:outline rounded-t-none outline-2 outline-offset-1 outline-app text-white rounded flex flex-cols justify-center"
      @click="zoomOut"
    >
      <fa-icon
        icon="fa-solid fa-minus"
        fixed-size
      />
    </a>
  </div>
</template>

<script>
import {Map as L_Map} from "leaflet";

export default {
    name: "MapControls",
    props: {
        mapObject: {
            type: L_Map,
            required: true,
        }
    },
    methods: {
        zoomIn() {
            this.mapObject.zoomIn();
        },
        zoomOut() {
            this.mapObject.zoomOut();
        }
    }
}
</script>

<style scoped>

</style>