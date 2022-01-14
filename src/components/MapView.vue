<template>
  <div class="h-full w-full">
    <div
      v-if="true"
      class="flex h-full w-full"
    >
      <l-map
        ref="map"
        class="h-full w-full map"
        :zoom="mapZoom"
        :min-zoom="minZoom"
        :center="mapCenter"
        :options="{ preferCanvas: true, zoomControl: false }"
        @ready="mapMounted"
      >
        <l-tile-layer
          :url="tileLayerUrl"
          :attribution="mapAttribution"
        />
        <l-icon-marker
          v-for="point in points"
          :key="`point-${point.id}`"
          :lat-lng="point.coords"
          :icon-data="point.icon"
          :fill-color="point.pinColor"
          :fill-opacity="1"
          :stroke="true"
          color="#fff"
          :hover-color="hoverPointColor"
          :weight="2"
          :radius="16"
          @click="selectPoint(point)"
        />
        <l-control
          position="topleft"
        >
          <MapControls
            v-if="mapObject"
            :map-object="mapObject"
          />
        </l-control>
        <MapLookup />
      </l-map>
      <AdBanner />
    </div>
    <div
      v-else
      class="h-full flex justify-center items-center"
    >
      <fa-icon
        icon="fa-solid fa-refresh"
        spin
        size="4x"
        fixed-size
      />
    </div>
    <router-view />
  </div>
</template>

<script>
import 'leaflet/dist/leaflet.css';
import {APP_COLOR} from "@/app-helpers";
import {LControl, LMap, LTileLayer} from "vue2-leaflet";
import LIconMarker from "@/leaflet-icon-marker";
import {mapGetters} from 'vuex';
import MapControls from "@/components/MapControls";
import AdBanner from "@/components/AdBanner";
import MapLookup from "@/components/MapLookup";

export default {
    name: 'MapView',
    components: {
        MapLookup,
        AdBanner,
        MapControls,
        LMap, LTileLayer, LIconMarker, LControl
    },
    data: () => ({
        mapObject: null,
    }),
    computed: {
        tileLayerUrl: () => 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        mapAttribution: () => '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        mapCenter: () => [52, 19],
        mapZoom: () => 7,
        minZoom: () => 4,
        hoverPointColor: () => APP_COLOR,
        maps() {
            return this.rawMaps;
        },
        points() {
            return this.rawPoints.map(x => {
                return {
                    ...x,
                    iconName: x.icon,
                    icon: this.$H.findIconDefinition(x.icon).icon,
                };
            });
        },
        ...mapGetters({
            rawPoints: 'points',
            rawMaps: 'maps',

        })
    },
    methods: {
        selectPoint(point) {
            this.$router.push({
                name: 'PointDetails',
                params: {
                    pointId: point.id
                }
            })
        },
        mapMounted() {
            this.mapObject = this.$refs.map.mapObject;
        }
    },
};
</script>