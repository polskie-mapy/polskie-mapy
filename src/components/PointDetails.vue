<template>
  <portal
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
          <div class="col-span-3 pb-3 relative flex">
            <span class="text-2xl font-semibold">
              {{ point.title }}
            </span>
            <div
              v-if="point.assumedCoords"
              class="ml-3 tooltipped"
            >
              <div class="tooltip">
                lokalizacja niedokładna, przybliżona bądź prawdopodobna
              </div>
              <div
                class="p-1 bg-black text-yellow-300 text-xs rounded leading-[0]"
              >
                <fa-icon
                  icon="fa-solid fa-triangle-exclamation"
                />
              </div>
            </div>
            <div
              class="absolute right-0 top-0 inline-block p-1 leading-none flex gap-x-3"
            >
              <div class="tooltipped">
                <div class="tooltip">
                  Zaproponuj poprawkę
                </div>
                <a
                  class="hover:text-app cursor-pointer"
                  @click.prevent="hideDetails"
                >
                  <fa-icon
                    icon="fa-regular fa-flag"
                    fixed-width
                  />
                </a>
              </div>
              <a
                class="hover:text-app cursor-pointer"
                @click.prevent="hideDetails"
              >
                <fa-icon
                  icon="fa-solid fa-times"
                  fixed-width
                />
              </a>
            </div>
          </div>
          <a
            v-if="ytLink"
            class="rounded hover:outline-2 hover:outline hover:outline-offset-1 hover:outline-app relative h-36 w-48"
            :href="ytLink"
            target="_blank"
          >
            <VideoThumbnail
              :thumbnail-url="ytThumbnail"
              object-class="h-36 w-48"
              class="h-36 w-48"
            />
          </a>
          <div
            v-else
            class="tooltipped"
          >
            <div class="tooltip">
              Brak nagrania :&lt;
            </div>
            <div
              class="rounded overflow-hidden relative bg h-36 w-48"
            >
              <div class="text-app bg-black/25 inset-0 absolute grid place-content-center">
                <fa-icon
                  icon="fa-solid fa-video-slash"
                  size="4x"
                  fixed-width
                />
              </div>
            </div>
          </div>
          <div class="col-span-2 grid grid-rows-1 auto-rows-min gap-y-1 relative">
            <p class="break-all max-h-40 overflow-y-auto">
              {{ point.excerpt }}
            </p>
            <p
              v-if="submitter"
              class="text-sm border-l-2 border-grey-500 pl-2"
            >
              pomógł -
              <a
                :href="submitter.url"
                class="hover:text-app font-bold"
                target="_blank"
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
import {DateTime} from 'luxon';
import {mapGetters} from "vuex";
import store from "@/store";
import VideoThumbnail from "@/components/VideoThumbnail";

export default {
    name: 'PointDetails',
    components: {VideoThumbnail},
    beforeRouteEnter(to, from, next) {
        if (store.getters.point(to.params.pointId)) {
            store.commit('setCurrentPoint', store.getters.point(to.params.pointId));
        }

        next();
    },
    beforeRouteUpdate(to, from, next) {
        if (store.getters.point(to.params.pointId)) {
            store.commit('setCurrentPoint', store.getters.point(to.params.pointId));
        }

        next();
    },
    computed: {
        links() {
            const STATIC_LINKS = [{
                type: 'map',
                url: this.$H.coords2GmapsPin(this.point.coords),
            }];

            return [
                ...STATIC_LINKS,
                ...this.point.links
            ].map(x => ({
                tooltip: this.$H.linkTypeDefaultTooltip(x.type),
                ...x
            }));
        },
        ytThumbnail() {
            const link = this.point.links.find(x => x.type === 'yt');

            if (typeof link !== 'undefined') {
                return this.$H.ytThumbUrl(link.url);
            }

            return null;
        },
        ytLink() {
            const link = this.point.links.find(x => x.type === 'yt');

            if (typeof link !== 'undefined') {
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
                url: this.$H.linkTypeUrl(submitter.type, submitter.user),
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
        },
        ...mapGetters({
            point: 'currentPoint',
        })
    },
    methods: {
        hideDetails() {
            this.$router.back();
        },
    },
};
</script>