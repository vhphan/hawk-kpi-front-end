import {basePath} from "@/config/constants";

export const sidebarItems = [
    {
        to: `${basePath}page1`,
        icon: "inbox",
        label: "Daily",
        id: 1,
    },
    {
        to: `${basePath}page2`,
        icon: "send",
        label: "Hourly",
        id: 2,
    }
];