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
    {
        to: `${basePath}about`,
        icon: "info",
        label: "About",
        id: 0,
        routeName: 'About',
        category: 'Info',
    },
    {
        to: `${basePath}page1`,
        icon: "calendar_month",
        label: "Daily",
        id: 1,
        routeName: 'Page1',
        category: 'Region',
    },
    {
        to: `${basePath}page2`,
        icon: "schedule",
        label: "Hourly",
        id: 2,
        routeName: 'Page2',
        category: 'Region',
    },
    {
        to: `${basePath}page3`,
        icon: "calendar_today",
        label: "Daily Flex",
        id: 3,
        routeName: 'Page3',
        comment: 'Daily Flex',
        category: 'Region',
    },
    {
        to: `${basePath}page4`,
        icon: "schedule",
        label: "Hourly Flex",
        id: 4,
        routeName: 'Page4',
        comment: 'Hourly Flex',
        category: 'Region',
    },

    {
        to: `${basePath}page5`,
        icon: "schedule",
        label: "Cluster Daily",
        id: 5,
        routeName: 'Page5',
        comment: 'Cluster Daily',
        category: 'Cluster',
    }

];

