<template>
  <portal
    v-if="detailsVisible"
    to="details"
  >
    <div
      class="absolute h-full w-full inset-0 flex flex-row z-modal bg-modal cursor-pointer"
      @click.self.prevent="hideDetails"
    >
      <div class="self-end flex w-full justify-center cursor-auto">
        <div
          class="bg-white rounded-t p-3 pb-0 shadow border-2 border-b-0 border-app grid grid-cols-[12rem_1fr_1fr] auto-rows-min gap-3 max-w-5xl"
        >
          <p class="text-2xl font-semibold col-span-3 pb-3 relative">
            {{ point.title }}
            <a
              class="absolute right-0 top-0 inline-block p-1 leading-none hover:text-app border-app cursor-pointer"
              @click.prevent="hideDetails"
            >
              <fa-icon
                icon="fa-solid fa-times"
                size="sm"
              />
            </a>
          </p>
          <a
            class="rounded overflow-hidden hover:outline-2 hover:outline hover:outline-offset-1 hover:outline-app relative bg-placeholder h-36 w-48"
            :href="ytLink"
            target="_blank"
          >
            <object
              type="image/jpg"
              :data="ytThumbnail"
              class="h-36 w-48"
            >
              <img
                src="../assets/placeholder.svg"
                alt=""
              >
            </object>
            <div class="text-app bg-black/25 inset-0 absolute grid place-content-center">
              <fa-icon
                icon="fa-regular fa-circle-play"
                size="4x"
                fixed-width
              />
            </div>
          </a>
          <div class="col-span-2 grid grid-rows-1 auto-rows-min gap-y-1 relative">
            <p class="text-ellipsis w-full">
              {{ point.excerpt }}
            </p>
            <p
              v-if="submitter"
              class="text-sm border-l-2 border-grey-500 pl-2"
            >
              podesłał -
              <a
                :href="submitter.url"
                class="hover:text-app font-bold"
              >
                @{{ submitter.user }}
              </a>
            </p>
          </div>
          <div class="col-span-2 flex gap-2 mb-3">
            <div
              v-for="link in links"
              :key="link.url"
              class="tooltipped"
              :style="link.type | linkTypeColorStyle"
            >
              <div
                v-if="link.tooltip"
                class="tooltip color-inherit"
              >
                {{ link.tooltip }}
              </div>
              <a
                :href="link.url"
                class="bg-point-details-link-var px-3 py-1 text-white outline-2 hover:outline-offset-1 hover:outline outline-app rounded"
                :title="link.tooltip"
                target="_blank"
              >
                <fa-icon
                  :icon="link.type | linkTypeIcon"
                  fixed-width
                />
              </a>
            </div>
          </div>
          <div class="grid grid-rows-2 justify-end cursor-default">
            <div class="tooltipped">
              <div
                class="tooltip"
              >
                {{ createdAt | prettyDate }}
              </div>
              <p class="text-xs leading-[0] text-right text-gray-500 underline underline-offset-4">
                <span>dodano {{ createdAtDesc }}</span>
              </p>
            </div>
            <div class="tooltipped">
              <div
                v-if="recordedAt"
                class="tooltip"
              >
                {{ recordedAt | prettyDate }}
              </div>
              <p class="text-xs leading-[0] text-right text-gray-500">
                <span>nagrano {{ recordedAtDesc }}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </portal>
</template>

<script>
const { DateTime } = require("luxon");

export default {
    name: 'PointDetails',
    props: {
        data: {
            type: Object,
            required: false,
            default: () => null,
        },
    },
    computed: {
        detailsVisible() {
            return this.data !== null;
        },
        point() {
            return this.data;
        },
        links() {
            const STATIC_LINKS = [{
                type: 'map',
                url: this.$H.coords2GmapsPin(this.point.coords),
                tooltip: 'Zobacz miejsce na Google Maps'
            }];

            return [...STATIC_LINKS, ...this.point.links];
        },
        ytThumbnail() {
            const link = this.point.links.find(x => x.type === 'yt');

            if (link !== null) {
                return this.$H.ytThumbUrl(link.url);
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
        submitter() {
            if (!this.point.submitters || this.point.submitters.length === 0) {
                return null;
            }

            const submitter = this.point.submitters[0];

            return {
                icon: this.$H.linkTypeIcon(submitter.source),
                url: this.$H.linkTypeUrl(submitter.source, submitter.user),
                ...submitter
            }
        },
        createdAt() {
            return DateTime.fromISO(this.point.createdAt);
        },
        recordedAt() {
            return this.point.recordedAt ? DateTime.fromISO(this.point.recordedAt) : null;
        },
        createdAtDesc() {
            return this.$H.dateTimeDiffHumans(DateTime.fromISO(this.createdAt));
        },
        recordedAtDesc() {
            if (this.recordedAt === null) {
                return '¯\\_(ツ)_/¯';
            }
          
            return this.$H.dateTimeDiffHumans(DateTime.fromISO(this.recordedAt));
        }
    },
    methods: {
        hideDetails() {
            this.$parent.selectedPointId = 0;
        },
    },
};
</script>