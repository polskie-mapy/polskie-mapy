import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import 'idb';
import 'leaflet.offline';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import PortalVue from 'portal-vue';
import VueHelpers from '@/helpers';
import '@/assets/ui.css';

library.add(fas, far, fab);
Vue.component('FaIcon', FontAwesomeIcon);

Vue.config.productionTip = false;

Vue.use(PortalVue);
Vue.use(VueHelpers);

new Vue({
    router,
    store,
    render: h => h(App),
}).$mount('#app');
