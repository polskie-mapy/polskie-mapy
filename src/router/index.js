import Vue from 'vue'
import VueRouter from 'vue-router'
import MapPage from '../views/MapPage.vue'
import PointDetails from "@/components/PointDetails";

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'Home',
        redirect: { name: 'MapPage', params: { mapId: 1 } },
    },
    {
        path: '/maps/:mapId/',
        name: 'MapPage',
        component: MapPage,
        children: [
            {
                path: 'point/:pointId',
                component: PointDetails,
                name: 'PointDetails'
            }
        ]
    },
    {
        path: '/about',
        name: 'About',
        component: () => import(/* webpackChunkName: "about" */ '@/views/AboutPage.vue')
    }
]

const router = new VueRouter({
    routes,
    linkActiveClass: '',
    linkExactActiveClass: ''
})

export default router
