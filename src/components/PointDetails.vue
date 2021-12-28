<template>
  <portal v-if="detailsVisible" to="details">
    <div class="absolute h-full w-full inset-0 flex flex-row z-modal bg-modal" @click="hideDetails">
      <div class="self-end flex w-full justify-center">
        <div
            class="bg-white rounded-t p-3 pb-0 shadow border-2 border-b-0 border-app grid grid-cols-3 auto-rows-min gap-2">
          <p class="text-2xl font-semibold col-span-3 pb-3">{{ point.title }}</p>
          <a class="shadow rounded overflow-hidden hover:outline-2 hover:outline hover:outline-offset-1 hover:outline-app"
             :href="ytLink" target="_blank">
            <img :src="ytThumbnail" class="h-32">
          </a>
          <div class="col-span-3 flex gap-1 mb-2">
            <a :href="link.url"
               :key="link.url"
               :style="link.type | linkTypeColorStyle"
               class="bg-point-details-link-var px-3 py-1 text-white outline-2 hover:outline outline-app"
               :title="link.tooltip"
               target="_blank"
               v-for="link in point.links">
              <fa-icon :icon="link.type | linkTypeIcon" fixed-width size="md"/>
            </a>
          </div>
        </div>
      </div>
    </div>
  </portal>
</template>

<script>
export default {
  name: 'PointDetails',
  props: {
    data: {
      type: Object,
      required: false,
    },
  },
  computed: {
    detailsVisible() {
      return this.data !== null;
    },
    point() {
      return this.data;
    },
    ytThumbnail() {
      const link = this.point.links.find(x => x.type === 'yt');

      if (link !== null) {
        return `https://img.youtube.com/vi/${this.$H.ytId(link.url)}/hqdefault.jpg`;
      }

      return null;
    },
    ytLink() {
      const link = this.point.links.find(x => x.type === 'yt');

      if (link !== null) {
        return link.url;
      }

      return null;
    },
  },
  methods: {
    hideDetails() {
      this.$parent.selectedPointId = 0;
    },
  },
};
</script>