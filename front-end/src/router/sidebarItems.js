import {basePath} from "@/config/constants";

export const sidebarItems = [
    {
        to: `${basePath}page1`,
        icon: "calendar_month",
        label: "Daily",
        id: 1,
        routeName: 'Page1',
    },
    {
        to: `${basePath}page2`,
        icon: "schedule",
        label: "Hourly",
        id: 2,
        routeName: 'Page2',
    },
    {
        to: `${basePath}page3`,
        icon: "calendar_today",
        label: "Daily Flex",
        id: 3,
        routeName: 'Page3',
        comment: 'Daily Flex',
    },
    {
        to: `${basePath}page4`,
        icon: "schedule",
        label: "Hourly Flex",
        id: 4,
        routeName: 'Page4',
        comment: 'Hourly Flex',
    },
    // {
    //     to: `${basePath}page5`,
    //     icon: "schedule",
    //     label: "Cell Daily",
    //     id: 5,
    //     routeName: 'Page5',
    //     comment: 'Cell Daily',
    // }
];