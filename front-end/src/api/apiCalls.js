import {api} from "@/plugins/http.js";

export const checkApi = () => {
    return api().get(`/`);
};

export const apiRoutes = {
    dailyStatsRegion: '/dailyStatsRegion',
}

export const apiGet = (routeName, params={}) => {
    return api().get(routeName, params);
}