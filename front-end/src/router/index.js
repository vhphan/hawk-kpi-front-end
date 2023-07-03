import {createRouter, createWebHistory} from 'vue-router';

import RegionStatsDailyPage from "../pages/mainPages/standard/RegionStatsDailyPage.vue";
import {basePath} from "../config/constants.js";

const routes = [
    {
        path: basePath + 'about',
        name: 'About',
        component: () => import('@/pages/mainPages/About.vue'),
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
        component: () => import('@/pages/mainPages/standard/RegionStatsHourlyPage.vue'),
    },
    {
        path: basePath + 'RegionStatsDailyFlexPage',
        name: 'RegionStatsDailyFlexPage',
        component: () => import('@/pages/subPages/StatsFlex.vue'),
        props: {
            timeUnit: 'daily',
            level: 'region',
        }
    },
    {
        path: basePath + 'RegionStatsHourlyFlexPage',
        name: 'RegionStatsHourlyFlexPage',
        component: () => import('@/pages/subPages/StatsFlex.vue'),
        props: {
            timeUnit: 'hourly',
            level: 'region',
        }
    },
    {
        path: basePath + 'ClusterStatsDailyPage',
        name: 'ClusterStatsDailyPage',
        component: () => import('@/pages/mainPages/standard/ClusterStatsDailyPage.vue'),
    },
    {
        path: basePath + 'ClusterStatsHourlyPage',
        name: 'ClusterStatsHourlyPage',
        component: () => import('@/pages/mainPages/standard/ClusterStatsHourlyPage.vue'),
    },


    {
        path: basePath + 'ClusterStatsDailyFlexPage',
        name: 'ClusterStatsDailyFlexPage',
        component: () => import('@/pages/subPages/StatsFlex.vue'),
        props: {
            timeUnit: 'daily',
            level: 'cluster',
        }
    },
    {
        path: basePath + 'ClusterStatsHourlyFlexPage',
        name: 'ClusterStatsHourlyFlexPage',
        component: () => import('@/pages/subPages/StatsFlex.vue'),
        props: {
            timeUnit: 'hourly',
            level: 'cluster',
        }
    },


];
const router = createRouter({
    base: basePath,
    history: createWebHistory(),
    mode: 'history',
    routes,
});


export default router;