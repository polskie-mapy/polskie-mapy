<template>
  <div class="h-full">
    <l-map
      v-if="loadingState === 2"
      class="h-full map"
      :zoom="mapZoom"
      :min-zoom="mapZoom"
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
    <MapPhantoms
      :icons="icons"
      @phantoms="setPhantoms"
      @loaded="loadingState++"
    />
    <PointDetails :data="selectedPointDetails" />
  </div>
</template>

<script>
import {uniq} from 'lodash';
import {divIcon} from 'leaflet';
import MapPhantoms from '@/components/MapPhantoms';
import PointDetails from '@/components/PointDetails';

export default {
    name: 'MapView',
    components: {
        MapPhantoms, PointDetails,
    },
    data: () => ({
        rawPoints: [],
        phantoms: [],
        loadingState: 0,
        selectedPointId: 0,
    }),
    computed: {
        tileLayerUrl: () => 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        mapAttribution: () => '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        mapCenter: () => [52, 19],
        mapZoom: () => 7,
        icons() {
            const pointIcons = this.rawPoints.map(x => x.icon);

            return uniq([...pointIcons, 'fa-solid:fa-marker']);
        },
        mapMarkerDefaultIconElement() {
            return this.phantoms['fa-solid:fa-marker'];
        },
        points() {
            return this.rawPoints.map(x => {
                const iconContainer = document.createElement('div');

                iconContainer.classList.add('pm-pin');

                iconContainer.style.setProperty('--pm-pin-color', x.pinColor);
                iconContainer.append((this.phantoms.find(y => x.name === y.icon)?.data || this.mapMarkerDefaultIconElement).cloneNode(true));
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
    },

    beforeMount() {
        this.loadingState = 0;
    },

    async mounted() {
        this.rawPoints = await (async () => {
            const resp = await fetch('http://localhost:3000/maps');
            const maps = await resp.json();

            this.loadingState++;

            return maps[0].points;
        })();
    },
    methods: {
        setPhantoms(phantoms) {
            this.phantoms = phantoms;
        },
        selectPoint(point) {
            this.selectedPointId = point.id;
        },
    },
};
</script>