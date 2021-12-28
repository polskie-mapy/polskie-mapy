<template>
  <div class="map-phantoms">
    <fa-icon :icon="icon.name" :key="icon.id" :ref="icon.id" v-for="icon in fontAwesomeIcons" fixed-width/>
  </div>
</template>

<script>
export default {
  name: 'MapPhantoms',

  props: {
    icons: {
      type: Array,
      default: () => [],
    },
  },

  computed: {
    fontAwesomeIcons() {
      return this.icons
          .filter(x => x.startsWith('fa-solid:') || x.startsWith('fa-regular:'))
          .map(x => ({
            name: x.split(':').join(' '),
            id: x,
          }));
    },
  },

  methods: {
    emitPhantoms() {
      const phantoms = this.icons.map(x => ({
        data: this.$refs[x][0],
        name: x,
      }));

      this.$emit('phantoms', phantoms);
    },
  },

  async mounted() {
    this.$el.attachShadow({mode: 'open'});

    const unwatch = this.$watch('icons', () => {
      unwatch();

      this.emitPhantoms();
      this.$watch('icons', () => this.emitPhantoms());
      this.$nextTick(() => this.$emit('loaded'));
    });
  },
};
</script>