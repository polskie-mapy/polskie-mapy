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
import {IconMarker} from "@/leaflet-icon-marker";
import {mapGetters} from 'vuex';
import MapControls from "@/components/MapControls";
import AdBanner from "@/components/AdBanner";
import MapLookup from "@/components/MapLookup";
import {findColorInvert} from "@/color-helpers";

export default {
    name: 'MapView',
    components: {
        MapLookup,
        AdBanner,
        MapControls,
        LMap, LTileLayer, LControl
    },
    data: () => ({
        mapObject: null,
        markers: [],
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
            return this.rawPoints
                .map(x => {
                    return {
                        ...x,
                        iconName: x.icon,
                        icon: this.$H.findIconDefinition(x.icon).icon,
                    };
                });
        },
        ...mapGetters({
            rawPoints: 'currentPoints',
            rawMaps: 'maps',
            currentMapsIds: 'currentMapsIds',
        })
    },
    watch: {
        points() {
            this.redrawMarkers();
        }
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
        redrawMarkers() {
            for (const marker of this.markers) {
                this.mapObject.removeLayer(marker);
            }

            this.markers = this.points.map(x => {
                const options = {
                    attribution: null,
                    bubblingMouseEvents: true,
                    className: null,
                    color: findColorInvert(x.pinColor),
                    dashArray: null,
                    dashOffset: null,
                    fill: true,
                    fillColor: x.pinColor,
                    fillOpacity: 1,
                    fillRule: "evenodd",
                    hoverColor: "#fb923c",
                    iconData: null,
                    interactive: true,
                    lStyle: null,
                    latLng: null,
                    layerType: undefined,
                    lineCap: "round",
                    lineJoin: "round",
                    name: undefined,
                    opacity: 1,
                    options: {},
                    pane: "markerPane",
                    radius: 16,
                    stroke: true,
                    visible: true,
                    weight: 2,
                };

                const marker = new IconMarker(x.coords, x.icon, options);
                marker.on('mouseover', () => {
                    marker._hover = true;
                    marker.redraw();
                });
                marker.on('mouseout', () => {
                    marker._hover = false;
                    marker.redraw();
                });
                marker.on('click', () => {
                    this.selectPoint(x);
                });

                this.mapObject.addLayer(marker);

                return marker;
            });
        },
        mapMounted() {
            this.mapObject = this.$refs.map.mapObject;

            this.$nextTick(() => this.redrawMarkers());
        }
    },
};
</script>