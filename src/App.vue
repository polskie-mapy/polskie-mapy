<template>
  <div
    id="app"
    class="grid grid-cols-1 grid-flow-rows bg-gray-700 h-screen overflow-hidden"
    :class="[colorScheme]"
  >
    <router-view />
    <portal name="modal" />
  </div>
</template>

<script>
import {mapState} from 'vuex';

export default {
    name: 'App',
    computed: {
        ...mapState([
            'colorScheme'
        ]),
    },
    watch: {
        colorScheme: {
            handler(colorScheme, oldColorScheme) {
                if (colorScheme === 'system') {
                    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                        this.$nextTick(() => this.$el.classList.add('dark'));
                    }
                } else if (oldColorScheme === 'system') {
                    this.$el.classList.remove('dark');
                }
            },
            immediate: true
        }
    },
}
</script>