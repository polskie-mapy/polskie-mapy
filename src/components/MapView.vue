<template>
  <div class="h-full w-full">
    <div
      v-if="true"
      class="flex h-full w-full flex-col md:flex-row"
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
          position="bottomleft"
        >
          <MapControls
            v-if="mapObject"
            :map-object="mapObject"
          />
        </l-control>
        <l-control
          position="topright"
        >
          <div class="text-app flex flex-row gap-2">
            <router-link
              :to="{ name: 'Funding' }"
              class="bg-white p-2 border-app border border-2 shadow rounded hover:outline outline-2 outline-offset-1 dark:bg-gray-700 sm:block hidden"
            >
              <fa-icon
                icon="fa-solid fa-beer"
                fixed-width
              />
            </router-link>
            <a
              href="#"
              class="bg-white p-2 border-app border border-2 shadow rounded hover:outline outline-2 outline-offset-1 dark:bg-gray-700 sm:block hidden"
              @click.prevent="toggleColorScheme"
            >
              <fa-icon
                :icon="colorSchemeIcon"
                fixed-width
              />
            </a>
            <router-link
              :to="{ name: 'About' }"
              class="bg-white p-2 border-app border border-2 shadow rounded hover:outline outline-2 outline-offset-1 dark:bg-gray-700"
            >
              <fa-icon
                icon="fa-solid fa-circle-exclamation"
                fixed-width
              />
            </router-link>
          </div>
        </l-control>
        <MapLookup />
      </l-map>
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
import {mapGetters, mapMutations, mapState} from 'vuex';
import MapControls from "@/components/MapControls.vue";
import MapLookup from "@/components/MapLookup.vue";
import {findColorInvert} from "@/color-helpers";
import {LatLng} from 'leaflet';

export default {
    name: 'MapView',
    components: {
        MapLookup,
        MapControls,
        LMap,
        LTileLayer,
        LControl
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
                .filter(x => x.coords && x.coords.length === 2)
                .map(x => {
                    return {
                        ...x,
                        pinColor: x.pinColor || APP_COLOR,
                        iconName: x.icon,
                        icon: this.$H.findIconDefinition(x.icon).icon,
                    };
                });
        },
        focusedMarker() {
            return this.markers.find(x => x._pointData.id === this.focusedPoint.id);
        },
        ...mapState({
            focusedPoint: 'focusedPoint',
            colorScheme: 'colorScheme',
            focusedLocation: 'focusedLocation',
        }),
        ...mapGetters({
            rawPoints: 'currentPoints',
            rawMaps: 'maps',
            currentMapsIds: 'currentMapsIds',
            colorSchemeIcon: 'colorSchemeIcon',
        })
    },
    watch: {
        points() {
            this.redrawMarkers();
        },
        focusedPoint() {
            this.$nextTick(() => {
                this.flyToFocusedPoint();
            });
        },
        focusedLocation() {
            this.$nextTick(() => {
                this.jumpToFocusedLocation();
            });
        }
    },
    methods: {
        selectPoint(point) {
            this.$router.push({
                name: 'PointDetails',
                params: {
                    pointId: point.id,
                    mapId: point.mapId,
                }
            });
        },
        redrawMarkers() {
            for (const marker of this.markers) {
                this.mapObject.removeLayer(marker);
            }

            this.markers = this.points.map(point => {
                const options = {
                    attribution: null,
                    bubblingMouseEvents: true,
                    className: null,
                    color: findColorInvert(point.pinColor),
                    dashArray: null,
                    dashOffset: null,
                    fill: true,
                    fillColor: point.pinColor,
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
                    focusWeight: 4,
                    focusColor: '#ed4546',
                };

                const marker = new IconMarker(point, options);
                marker.on('mouseover', () => {
                    marker._hover = true;
                    marker.redraw();
                });
                marker.on('mouseout', () => {
                    marker._hover = false;
                    marker.redraw();
                });
                marker.on('click', () => {
                    this.selectPoint(point);
                });

                this.mapObject.addLayer(marker);

                return marker;
            });
        },
        mapMounted() {
            this.mapObject = this.$refs.map.mapObject;

            this.$nextTick(() => this.redrawMarkers());
            this.$nextTick(() => this.flyToFocusedPoint());
        },
        flyToFocusedPoint() {
            if (this.focusedPoint) {
                // need to invoke after whole render cycle completed
                // otherwise race can occur
                this.$nextTick(() => {
                    this.mapObject.flyTo(
                        new LatLng(this.focusedPoint.coords[0], this.focusedPoint.coords[1]),
                        10 // target zoom level
                    );
                    this.markers.forEach(x => x.blur());
                    this.focusedMarker.focus();
                });
            } else {
                this.markers.forEach(x => x.blur());
            }
        },
        jumpToFocusedLocation() {
            if (this.focusedLocation) {
                // need to invoke after whole render cycle completed
                // otherwise race can occur
                this.$nextTick(() => {
                    this.mapObject.flyTo(
                        new LatLng(this.focusedLocation[0], this.focusedLocation[1]),
                        10, // target zoom level
                    {animate: false}
                    );
                });
            }
        },

        ...mapMutations([
            'toggleColorScheme'
        ]),
    },
};
</script>