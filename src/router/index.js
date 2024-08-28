import Vue from 'vue'
import {createRouter, createWebHashHistory, createWebHistory} from 'vue-router'
import MapPage from '../views/MapPage.vue'
import PointDetails from "@/components/PointDetails.vue";

const routes = [
    {
        path: '/',
        component: MapPage,
        children: [
            {
                path: 'about',
                name: 'About',
                component: () => import('@/views/AboutModal.vue')
            },
            {
                path: 'funding',
                name: 'Funding',
                component: () => import('@/views/FundingModal.vue')
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
                name: 'PointDetails',
                props: (route) => ({pointId: Number.parseInt(route.params.pointId, 10)})
            }
        ],
        props: (route) => ({mapId: Number.parseInt(route.params.mapId, 10)})
    },
]

const router = createRouter({
    routes,
    linkActiveClass: '',
    linkExactActiveClass: '',
    history: import.meta.env.PROD ? createWebHistory() : createWebHashHistory(),
})

export default router
