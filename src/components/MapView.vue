<template>
  <div class="h-full w-full">
    <div
      v-if="loadingState === 1"
      class="flex h-full w-full"
    >
      <l-map
        ref="map"
        class="h-full w-full map"
        :zoom="mapZoom"
        :min-zoom="minZoom"
        :center="mapCenter"
        :options="{ preferCanvas: true, zoomControl: false }"
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
        <l-control position="topleft">
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
        </l-control>
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
      </l-map>
      <div class="bg-white border border-black flex flex-col justify-center w-[300px] text-gray-500 relative">
        <div class="text-center absolute top-0 inset-x-0 text-xs bg-white">
          Ta reklama pomaga utrzymać mapkę ( ͡~ ͜ʖ ͡°)
        </div>
        <div class="text-center block">
          Ad
        </div>
      </div>
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
    <PointDetails :data="selectedPointDetails" />
  </div>
</template>

<script>
import 'leaflet/dist/leaflet.css';
import PointDetails from '@/components/PointDetails';
import {uniq} from "lodash";
import {APP_COLOR} from "@/app_helpers";
import {LControl, LMap, LTileLayer} from "vue2-leaflet";
import LIconMarker from "@/leaflet-icon-marker";

export default {
    name: 'MapView',
    components: {
        PointDetails, LMap, LTileLayer, LIconMarker, LControl
    },
    data: () => ({
        rawPoints: [],
        rawMaps: [],
        loadingState: 0,
        selectedPointId: 0,
        menuVisible: false,
    }),
    computed: {
        tileLayerUrl: () => 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        mapAttribution: () => '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        mapCenter: () => [52, 19],
        mapZoom: () => 7,
        minZoom: () => 6,
        hoverPointColor: () => APP_COLOR,
        pinGroups() {
            return this.rawPoints.reduce((a, v) => {
                if (!a.includes(v.group)) {
                    return [...a, v.group];
                }

                return a;
            }, [])
        },
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
        selectedPointDetails() {
            if (this.selectedPointId === 0) {
                return null;
            }

            return this.points.find(x => x.id === this.selectedPointId);
        },
        fontAwesomeIcons() {
            return uniq(this.rawPoints.map(x => x.icon || 'fa-solid:fa-marker'))
                .filter(x => x.startsWith('fa-solid:') || x.startsWith('fa-regular:'))
                .map(x => ({
                    name: x.split(':').join(' '),
                    id: x,
                }));
        },
    },

    beforeMount() {
        this.loadingState = 0;
    },

    async mounted() {
        this.rawMaps = await (async () => {
            // https://cdn.jsdelivr.net/gh/polskie-mapy/data@master/maps.json
            const resp = await fetch('http://localhost:3000/maps');
            const maps = await resp.json();

            return maps;
        })();

        this.rawPoints = this.rawMaps[0].points;

        await this.$nextTick();

        this.loadingState++;
    },
    methods: {
        selectPoint(point) {
            this.selectedPointId = point.id;
        },
        zoomIn() {
            this.$refs.map.mapObject.zoomIn();
        },
        zoomOut() {
            this.$refs.map.mapObject.zoomOut();
        }
    },

};
</script>