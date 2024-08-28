import App from './App.vue';
import router from './router';
import store from './store';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import PortalVue from 'portal-vue';
import VueHelpers from '@/helpers';
import * as Sentry from "@sentry/vue";
import { BrowserTracing } from "@sentry/tracing";
import 'virtual:windi.css';
import 'virtual:windi-devtools';
import '@/assets/ui.css';
import { APP_VERSION } from './app-helpers';
import {createApp} from "vue";

library.add(fas, far, fab);

const app = createApp(App)

app.component('FaIcon', FontAwesomeIcon);

app.use(PortalVue);
app.use(VueHelpers);
app.use(store);
app.use(router);

if (import.meta.env.PROD && import.meta.env.VITE_SENTRY_DSN) {
    Sentry.init({
        app,
        release: APP_VERSION,
        logErrors: true,
        dsn: import.meta.env.VITE_SENTRY_DSN,
        integrations: [
            new BrowserTracing({
                routingInstrumentation: Sentry.vueRouterInstrumentation(router),
                tracingOrigins: [/^(\*\.)?mapainternetow\.pl/, /^\//],
            }),
        ],
        tracesSampleRate: import.meta.env.VITE_SENTRY_TRACES_SAMPLE_RATE || 0,
    });
}

app.mount('#app');