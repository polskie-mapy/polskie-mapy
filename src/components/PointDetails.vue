<template>
  <portal v-if="detailsVisible" to="details">
    <div class="absolute h-full w-full inset-0 flex flex-row z-modal bg-modal" @click="hideDetails">
      <div class="self-end flex w-full justify-center">
        <div class="bg-white rounded-t p-3 pb-0 shadow border-2 border-b-0 border-red-200 grid grid-cols-3 auto-rows-min">
          <p class="text-6x font-semibold col-span-3 pb-3">{{ point.title }}</p>
          <a class="shadow rounded overflow-hidden hover:outline-2 hover:outline hover:outline-offset-1 hover:outline-red-200" :href="ytLink" target="_blank">
            <img :src="ytThumbnail" class="h-32">
          </a>
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
    }
  },
  methods: {
    hideDetails() {
      this.$parent.selectedPointId = 0;
    }
  }
};
</script>