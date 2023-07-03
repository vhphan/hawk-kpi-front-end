import {createRouter, createWebHistory} from 'vue-router';

import RegionStatsDailyPage from "../pages/RegionStatsDailyPage.vue";
import {basePath} from "../config/constants.js";

const routes = [
    {
        path: basePath + 'about',
        name: 'About',
        component: () => import('@/pages/About.vue'),
    },
    {
        path: "/",
        alias: [basePath, '/'],
        redirect: {name: 'RegionStatsDailyPage'},
        name: 'Others',
    },
    {
        path: basePath + 'RegionStatsDailyPage',
        name: 'RegionStatsDailyPage',
        component: RegionStatsDailyPage,
        meta: {label: 'Home'}
    },

    {
        path: basePath + 'RegionStatsHourlyPage',
        name: 'RegionStatsHourlyPage',
        component: () => import('@/pages/RegionStatsHourlyPage.vue'),
    },
    {
        path: basePath + 'RegionStatsDailyFlexPage',
        name: 'RegionStatsDailyFlexPage',
        component: () => import('@/pages/RegionStatsDailyFlexPage.vue'),
    },
    {
        path: basePath + 'RegionStatsHourlyFlexPage',
        name: 'RegionStatsHourlyFlexPage',
        component: () => import('@/pages/RegionStatsHourlyFlexPage.vue'),
    },
    {
        path: basePath + 'ClusterStatsDailyFlexPage',
        name: 'ClusterStatsDailyFlexPage',
        component: () => import('@/pages/ClusterStatsDailyPage.vue'),
    },
    {
        path: basePath + 'ClusterStatsHourlyFlexPage',
        name: 'ClusterStatsHourlyFlexPage',
        component: () => import('@/pages/ClusterStatsHourlyPage.vue'),
    },


];
const router = createRouter({
    base: basePath,
    history: createWebHistory(),
    mode: 'history',
    routes,
});


export default router;