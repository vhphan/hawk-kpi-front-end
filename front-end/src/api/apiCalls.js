import {api} from "@/plugins/http.js";

export const checkApi = () => {
    return api().get(`/`);
};

export const apiRoutes = {
    dailyStatsRegion: '/dailyStatsRegion',
    hourlyStatsRegion: '/hourlyStatsRegion',
    dailyStatsRegionFlex: '/dailyStatsRegionFlex',
    hourlyStatsRegionFlex: '/hourlyStatsRegionFlex',
//     cluster level
    dailyStatsCluster: '/dailyStatsCluster',
    hourlyStatsCluster: '/hourlyStatsCluster',

//     cell level
    dailyStats: '/dailyStats',
    hourlyStats: '/hourlyStats',
    cellsList: '/cellsList',
    clustersList: '/clustersList',
}

export const apiGet = (urlRef) => {
    return api().get(urlRef);
}