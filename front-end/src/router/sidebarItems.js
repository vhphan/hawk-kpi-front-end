import {basePath} from "@/config/constants";

export const sidebarItemsCategories = [
    {
        label: 'Info',
    },
    {
        label: 'Region',
    },
    {
        label: 'Cluster',
    },
    {
        label: 'Cell',
    }
];

export const sidebarItems = [
    {
        to: `${basePath}about`,
        icon: "info",
        label: "About",
        id: 0,
        routeName: 'About',
        category: 'Info',
    },
    {
        to: `${basePath}RegionStatsDailyPage`,
        icon: "calendar_month",
        label: "Daily",
        id: 1,
        routeName: 'RegionStatsDailyPage',
        category: 'Region',
    },
    {
        to: `${basePath}RegionStatsHourlyPage`,
        icon: "schedule",
        label: "Hourly",
        id: 2,
        routeName: 'RegionStatsHourlyPage',
        category: 'Region',
    },
    {
        to: `${basePath}RegionStatsDailyFlexPage`,
        icon: "calendar_today",
        label: "Daily Flex",
        id: 3,
        routeName: 'RegionStatsDailyFlexPage',
        comment: 'Daily Flex',
        category: 'Region',
    },
    {
        to: `${basePath}RegionStatsHourlyFlexPage`,
        icon: "schedule",
        label: "Hourly Flex",
        id: 4,
        routeName: 'RegionStatsHourlyFlexPage',
        comment: 'Hourly Flex',
        category: 'Region',
    },

    {
        to: `${basePath}ClusterStatsDailyPage`,
        icon: "calendar_today",
        label: "Daily",
        id: 5,
        routeName: 'ClusterStatsDailyPage',
        comment: 'Daily',
        category: 'Cluster',
    },
    {
        to: `${basePath}ClusterStatsHourlyPage`,
        icon: "schedule",
        label: "Hourly",
        id: 6,
        routeName: 'ClusterStatsHourlyPage',
        comment: 'Hourly',
        category: 'Cluster',
    },
    {
        to: `${basePath}ClusterStatsDailyFlexPage`,
        icon: "calendar_today",
        label: "Daily Flex",
        id: 7,
        routeName: 'ClusterStatsDailyFlexPage',
        comment: 'Daily Flex',
        category: 'Cluster',
    },
    {
        to: `${basePath}ClusterStatsHourlyFlexPage`,
        icon: "schedule",
        label: "Hourly Flex",
        id: 8,
        routeName: 'ClusterStatsHourlyFlexPage',
        comment: 'Hourly Flex',
        category: 'Cluster',
    },
    {
        to: `${basePath}CellStatsDailyPage`,
        icon: "calendar_today",
        label: "Daily",
        id: 9,
        routeName: 'CellStatsDailyPage',
        comment: 'Daily Cell',
        category: 'Cell',
    }

];

