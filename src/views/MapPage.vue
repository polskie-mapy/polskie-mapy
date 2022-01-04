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

export default {
  name: 'MapViewer',
  components: {
    MapView,
  },
};
</script>
