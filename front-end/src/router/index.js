import {createRouter, createWebHistory} from 'vue-router';
import {basePath} from "../config/constants.js";
import StatsStd from "@/pages/subPages/StatsStd.vue";

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
        component: StatsStd,
        props: {
            timeUnit: 'daily',
            level: 'region',
        },
        meta: {label: 'Home'}
    },

    {
        path: basePath + 'RegionStatsHourlyPage',
        name: 'RegionStatsHourlyPage',
        component: () => import('@/pages/subPages/StatsStd.vue'),
        props: {
            timeUnit: 'hourly',
            level: 'region',
        }
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
        component: () => import('@/pages/subPages/StatsStd.vue'),
        props: {
            timeUnit: 'daily',
            level: 'cluster',
        }
    },
    {
        path: basePath + 'ClusterStatsHourlyPage',
        name: 'ClusterStatsHourlyPage',
        component: () => import('@/pages/subPages/StatsStd.vue'),
        props: {
            timeUnit: 'hourly',
            level: 'cluster',
        }
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