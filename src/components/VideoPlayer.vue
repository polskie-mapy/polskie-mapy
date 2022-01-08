<template>
  <iframe
    id="video-player"
    type="text/html"
    width="640"
    height="360"
    :src="url"
    frameborder="0"
  />
</template>
<script>
export default {
    name: "VideoPlayer",
    props: {
        url: {
            required: true,
            type: String
        }
    },
}
</script>