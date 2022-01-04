<template>
  <div class="h-full">
    <l-map
      v-if="loadingState === 1"
      class="h-full map"
      :zoom="mapZoom"
      :min-zoom="minZoom"
      :center="mapCenter"
    >
      <l-tile-layer
        :url="tileLayerUrl"
        :attribution="mapAttribution"
      />
      <l-marker
        v-for="point in points"
        :key="`point-${point.id}`"
        :lat-lng="point.coords"
        :icon="point.icon"
        @click="selectPoint(point)"
      />
    </l-map>
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
    <div ref="phantoms">
      <fa-icon
        v-for="icon in fontAwesomeIcons"
        :key="icon.id"
        :ref="icon.id"
        :icon="icon.name"
        fixed-width
      />
    </div>
  </div>
</template>

<script>
import {divIcon} from 'leaflet';
import PointDetails from '@/components/PointDetails';
import {uniq} from "lodash";
// import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

export default {
    name: 'MapView',
    components: {
        PointDetails,
    },
    data: () => ({
        rawPoints: [],
        loadingState: 0,
        selectedPointId: 0,
    }),
    computed: {
        tileLayerUrl: () => 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        mapAttribution: () => '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        mapCenter: () => [52, 19],
        mapZoom: () => 7,
        minZoom: () => 6,
        points() {
            return this.rawPoints.map(x => {
                const iconContainer = document.createElement('div');
                iconContainer.classList.add('pm-pin');
                iconContainer.style.setProperty('--pm-pin-color', x.pinColor);
                iconContainer.append(this.$refs[x.icon][0].cloneNode(true));
                iconContainer.title = `${x.title}\n\n${x.excerpt}`;

                const icon = divIcon({
                    html: iconContainer,
                    iconSize: false, // custom css will be used to determine size
                    className: '',
                });

                return {
                    ...x,
                    iconName: x.icon,
                    icon,
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
        this.rawPoints = await (async () => {
            const resp = await fetch('http://localhost:3000/maps');
            const maps = await resp.json();

            return maps[0].points;
        })();

        await this.$nextTick();

        this.loadingState++;

    // await this.$nextTick();
    //
    // this.$nextTick(() => {
    //     this.$refs.phantoms.attachShadow({mode: 'open'});
    //
    //     this.loadingState++;
    // });
    },
    methods: {
        selectPoint(point) {
            this.selectedPointId = point.id;
        },
    },
};
</script>