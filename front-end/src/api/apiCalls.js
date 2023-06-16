import {api} from "@/plugins/http.js";

export const checkApi = () => {
    return api().get(`/`);
};

export const apiRoutes = {
    dailyStatsRegion: '/dailyStatsRegion',
    hourlyStatsRegion: '/hourlyStatsRegion',
    dailyStatsRegionFlex: '/dailyStatsRegionFlex',
    hourlyStatsRegionFlex: '/hourlyStatsRegionFlex',
//     cell level
    dailyStats: '/dailyStats',
    hourlyStats: '/hourlyStats',
    cellsList: '/cellsList',
}

export const apiGet = (urlRef) => {
    return api().get(urlRef);
}