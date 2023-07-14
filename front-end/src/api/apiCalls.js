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
    dailyStatsClusterFlex: '/dailyStatsClusterFlex',
    hourlyStatsClusterFlex: '/hourlyStatsClusterFlex',

//     cell level
    dailyStatsCell: '/dailyStatsCell',
    hourlyStatsCell: '/hourlyStatsCell',
    dailyStatsCellFlex: '/dailyStatsCellFlex',
    hourlyStatsCellFlex: '/hourlyStatsCellFlex',


    // Lists
    cellsList: '/cellsList',
    sitesList: '/sitesList',
    clustersList: '/clustersList',
    kpiList: '/kpiList',
    siteIdPrefixList: '/siteIdPrefixList',
}

export const apiGet = (urlRef, options={}) => {
    return api().get(urlRef, options);
}

