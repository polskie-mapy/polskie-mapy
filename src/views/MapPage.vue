<template>
  <div id="map-viewer">
    <MapView ref="mapView" />
    <portal-target
      name="details"
      slim
    />
  </div>
</template>

<script>
import MapView from '@/components/MapView';
import store from '@/store';

export default {
    name: 'MapPage',
    components: {
        MapView,
    },
    async beforeRouteEnter(to, from, next) {
        const maps = await (async () => {
            // https://cdn.jsdelivr.net/gh/polskie-mapy/data@master/maps.json
            const resp = await fetch('http://localhost:3000/maps');

            return resp.json();
        })();

        store.commit('addMaps', maps);

        if (store.getters.map(to.params.mapId)) {
            store.commit('setCurrentMap', store.getters.map(to.params.mapId));

            const points = await (async () => {
                const resp = await fetch(`http://localhost:3000/maps/${store.getters.currentMap.id}/points`);

                return resp.json();
            })();

            store.commit('addPoints', points);
        }

        next(vm => {
            if (to.query.focusPoint) {
                const point = vm.$store.getters.point(to.query.focusPoint);

                if (point) {
                    vm.$store.commit('setFocusedPoint', point);
                }
            }
        });
    },
    async beforeRouteUpdate(to, from, next) {
        if (from.params.mapId != to.params.mapId) {
            const maps = await (async () => {
                // https://cdn.jsdelivr.net/gh/polskie-mapy/data@master/maps.json
                const resp = await fetch(`http://localhost:3000/maps/${store.getters.defaultMap.id}`);

                return resp.json();
            })();

            store.commit('addMaps', maps);
        }

        next();

        if (to.query.focusPoint) {
            const point = this.$store.getters.point(to.query.focusPoint);

            if (point) {
                this.$store.commit('setFocusedPoint', point);
            } else {
                this.$store.commit('unsetFocusedPoint');
            }
        } else {
            this.$store.commit('unsetFocusedPoint');
        }
    }
};
</script>
