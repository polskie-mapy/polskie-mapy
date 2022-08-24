<template>
  <div id="map-viewer">
    <MapView ref="mapView" />
    <portal-target
      name="details"
      slim
    />
    <portal-target
      name="modal"
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
    async beforeRouteEnter(to, _from, next) {
        await store.dispatch('fetchMaps');

        if (store.getters.map(to.params.mapId)) {
            store.commit('setCurrentMap', store.getters.map(to.params.mapId));

            await store.dispatch('fetchPoints', to.params.mapId + '');
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
        if (
            typeof to.params.mapId !== 'undefined'
            && (from.params.mapId != to.params.mapId
            || !this.$store.getters.currentMapsIds.includes(to.params.mapId + ''))
        ) {
            await this.$store.dispatch('fetchPoints', to.params.mapId + '');

            store.commit('setCurrentMap', store.getters.map(to.params.mapId));
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
