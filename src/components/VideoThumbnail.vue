<template>
  <div
    class="video-thumbnail-container"
  >
    <div
      v-if="!failed"
      class="video-thumbnail overflow-hidden rounded w-full h-full relative"
    >
      <object
        ref="thumbnailObject"
        type="image/jpg"
        :data="thumbnailUrl"
        :class="objectClass"
      >
        <div class="h-full w-full grid place-items-center text-white bg-gray-300">
          <fa-icon
            icon="fa-solid fa-ellipsis"
            class="slide-top"
            size="5x"
          />
        </div>
      </object>
      <div
        class="text-app bg-black/25 inset-0 absolute grid place-content-center"
      >
        <fa-icon
          icon="fa-regular fa-circle-play"
          size="4x"
          fixed-width
        />
      </div>
    </div>
    <div
      v-else
      class="h-full w-full tooltipped"
    >
      <div class="tooltip">
        Nagranie zostało usunięte
      </div>
      <div
        class="text-red-600 bg-gray-300 inset-0 absolute grid place-content-center rounded"
      >
        <fa-icon
          icon="fa-solid fa-link-slash"
          size="4x"
          fixed-width
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
    name: "VideoThumbnail",
    props: {
        thumbnailUrl: {
            type: String,
            required: true,
        },
        objectClass: {
            type: [String, Array, Object],
            default: '',
        }
    },
    data: () => ({
        failed: false,
    }),
    mounted() {
        this.$refs.thumbnailObject.addEventListener('error', () => {
            this.failed = true;
            // TODO: log that, so we can notice dead links
        })
    }
}
</script>

<style scoped>

</style>