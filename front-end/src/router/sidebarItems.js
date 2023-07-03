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
    // {
    //     label: 'Cell',
    // }
];

export const sidebarItems = [
    // {
    //     to: `${basePath}about`,
    //     icon: "info",
    //     label: "About",
    //     id: 0,
    //     routeName: 'About',
    //     category: 'Info',
    // },
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
        to: `${basePath}ClusterStatsDailyFlexPage`,
        icon: "calendar_today",
        label: "Cluster Daily",
        id: 5,
        routeName: 'ClusterStatsDailyFlexPage',
        comment: 'Cluster Daily',
        category: 'Cluster',
    },

    {
        to: `${basePath}page6`,
        icon: "schedule",
        label: "Cluster Hourly",
        id: 6,
        routeName: 'Page6',
        comment: 'Cluster Hourly',
        category: 'Cluster',
    }

];

