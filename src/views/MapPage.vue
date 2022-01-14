<template>
  <div id="map-viewer">
    <MapView />
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

        if (store.getters.map(to.params.pointId)) {
            store.commit('setCurrentMap', store.getters.map(to.params.pointId));
        }

        const points = await (async () => {
            const resp = await fetch(`http://localhost:3000/maps/${store.getters.currentMap.id}/points`);

            return resp.json();
        })();

        store.commit('addPoints', points);

        next();
    },
    // async beforeRouteUpdate(to, from, next) {
    //     const maps = await (async () => {
    //         // https://cdn.jsdelivr.net/gh/polskie-mapy/data@master/maps.json
    //         const resp = await fetch(`http://localhost:3000/maps/${store.getters.defaultMap.id}`);
    //
    //         return resp.json();
    //     })();
    //
    //     store.commit('addMaps', maps);
    // }
};
</script>
