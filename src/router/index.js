import Vue from 'vue'
import VueRouter from 'vue-router'
import MapPage from '../views/MapPage.vue'
import PointDetails from "@/components/PointDetails";

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        component: MapPage,
        children: [
            {
                path: 'about',
                name: 'About',
                component: () => import(/* webpackChunkName: "about" */ '@/views/AboutModal.vue')
            }
        ]
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
]

const router = new VueRouter({
    routes,
    linkActiveClass: '',
    linkExactActiveClass: ''
})

export default router
