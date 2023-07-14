import {defineStore} from 'pinia';
import {useLocalStorage} from "@vueuse/core";
import {apiRoutes} from "@/api/apiCalls.js";
import {generateUrl} from "@/utils/myFunctions.js";
import {apiAx} from "@/plugins/httpAx.js";

export const useMainStore = defineStore({
    id: 'mainStore',
    state: () => ({
        version: useLocalStorage('version', '0.0.0'),
        dailyStatsRegion: useLocalStorage('dailyStatsRegion', {
            nr: {},
            lte: {},
        }),

        hourlyStatsRegion: useLocalStorage('hourlyStatsRegion', {
            nr: {},
            lte: {},
        }),

        dailyStatsCluster: useLocalStorage('dailyStatsCluster', {
            nr: {},
            lte: {},
        }),

        hourlyStatsCluster: useLocalStorage('hourlyStatsCluster', {
            nr: {},
            lte: {},
        }),

        dailyStatsRegionMeta: useLocalStorage('dailyStatsRegionMeta', {
            nr: {},
            lte: {},
        }),

        hourlyStatsRegionMeta: useLocalStorage('hourlyStatsRegionMeta', {
            nr: {},
            lte: {},
        }),

        dailyStatsClusterMeta: useLocalStorage('dailyStatsClusterMeta', {
            nr: {},
            lte: {},
        }),

        hourlyStatsClusterMeta: useLocalStorage('hourlyStatsClusterMeta', {
            nr: {},
            lte: {},
        }),

        dailyStatsCell: useLocalStorage('dailyStatsCell', {
            nr: {},
            lte: {},
        }),

        hourlyStatsCell: useLocalStorage('hourlyStatsCell', {
            nr: {},
            lte: {},
        }),

        dailyStatsCellMeta: useLocalStorage('dailyStatsCellMeta', {
            nr: {},
            lte: {},
        }),

        hourlyStatsCellMeta: useLocalStorage('hourlyStatsCellMeta', {
            nr: {},
            lte: {},
        }),

        dailyStatsRegionFlex: useLocalStorage('dailyStatsRegionFlex', {
            nr: {},
            lte: {},
        }),

        hourlyStatsRegionFlex: useLocalStorage('hourlyStatsRegionFlex', {
            nr: {},
            lte: {},
        }),

        dailyStatsClusterFlex: useLocalStorage('dailyStatsClusterFlex', {
            nr: {},
            lte: {},
        }),

        hourlyStatsClusterFlex: useLocalStorage('hourlyStatsClusterFlex', {
            nr: {},
            lte: {},
        }),

        dailyStatsRegionFlexMeta: useLocalStorage('dailyStatsRegionFlexMeta', {
            nr: {},
            lte: {},
        }),

        hourlyStatsRegionFlexMeta: useLocalStorage('hourlyStatsRegionFlexMeta', {
            nr: {},
            lte: {},
        }),

        dailyStatsClusterFlexMeta: useLocalStorage('dailyStatsClusterFlexMeta', {
            nr: {},
            lte: {},
        }),

        hourlyStatsClusterFlexMeta: useLocalStorage('hourlyStatsClusterFlexMeta', {
            nr: {},
            lte: {},
        }),

        regionsArray: [
            'ALL',
            'CENTRAL',
            'EASTERN',
            'NORTHERN',
            'SOUTHERN',
            'SABAH',
            'SARAWAK',
        ],

        clusters: useLocalStorage('clusters', []),

        regions: [
            {
                label: 'CENTRAL',
                value: 'CENTRAL'
            },
            {
                label: 'EASTERN',
                value: 'EASTERN'
            },
            {
                label: 'NORTHERN',
                value: 'NORTHERN'
            },
            {
                label: 'SOUTHERN',
                value: 'SOUTHERN'
            },
            {
                label: 'SABAH',
                value: 'SABAH'
            },
            {
                label: 'SARAWAK',
                value: 'SARAWAK'
            },
            {
                label: 'ALL',
                value: null
            },
        ],

        selectedRegion: useLocalStorage('selectedRegion', 'ALL'),

        selectedCell: useLocalStorage('selectedCell', {
            nr: null,
            lte: null,
        }),

        selectedCluster: useLocalStorage('selectedCluster', {
            region: null,
            cluster_id: null,
        }),

        darkMode: useLocalStorage('darkMode', true),

        colorMapping: useLocalStorage('colorMapping', {
            'Maxis': '#72fa05',
            'Celcom': '#37ffd4',
            'Digi': '#fff408',
            'UMobile': '#ffa600',
            'YTL': '#795E61',
            'TM': '#ff00ff',
        }),

        kpiToExclude: useLocalStorage('kpiToExclude', [
            '5g_ho_success_rate_dnb_5g_to_dnb',
            'inter_rat_ho_success_rate_dnb_5g_to_mno_4g',
        ]),

        chartSizeClass: useLocalStorage('chartSizeClass',
            {label: 'm', value: 'col-xs-12 col-md-6 col-lg-4 col-xl-3'},
        ),

        chartSizeClassOptions: [
            {label: 'm', value: 'col-xs-12 col-md-6 col-lg-4 col-xl-3'},
            {label: 'l', value: 'col-xs-12 col-md-6 col-lg-5 col-xl-6'},
            {label: 'xl', value: 'col-xs-12 col-md-6 col-lg-6 col-xl-8'},
            {label: 'xxl', value: 'col-xs-12 col-md-6 col-lg-8 col-xl-9'},
            {label: 'full', value: 'col-xs-12 col-md-6 col-lg-12 col-xl-12'},
        ],

        selectedTech: useLocalStorage('selectedTech', 'nr'),

        kpiList: useLocalStorage('kpiList', []),
        kpiListFlex: useLocalStorage('kpiListFlex', []),
        siteIdPrefixList: useLocalStorage('siteIdPrefixList', []),

    }),
    actions: {
        saveDailyStatsRegion(data, tech) {
            this.dailyStatsRegion[tech] = data;
        },
        saveHourlyStatsRegion(data, tech) {
            this.hourlyStatsRegion[tech] = data;
        },
        async getSiteIdPrefixList() {
            try {
                this.siteIdPrefixList = (await apiAx().get(apiRoutes.siteIdPrefixList)).data.data;
            } catch (e) {
                console.log(e);
            }
        }
    },
    getters: {
        kpiColumns: (state) => {
            const {dailyStatsRegion, dailyStatsCluster} = state;
            return {
                nr: [
                    ...Object.keys(dailyStatsRegion.nr),
                    ...Object.keys(dailyStatsCluster.nr)
                ],
                lte: [
                    ...Object.keys(dailyStatsRegion.lte),
                    ...Object.keys(dailyStatsCluster.lte),
                ],
            };
        },
        kpiColumnsFlex: (state) => {
            const {
                dailyStatsRegionFlex,
                dailyStatsClusterFlex
            } = state;
            return {
                nr: [
                    ...Object.keys(dailyStatsRegionFlex.nr),
                    ...Object.keys(dailyStatsClusterFlex.nr),
                ],
                lte: [
                    ...Object.keys(dailyStatsRegionFlex.lte),
                    ...Object.keys(dailyStatsClusterFlex.lte),
                ],

            };
        },
        kpiColumnsHourly: (state) => {
            const {hourlyStatsRegion, hourlyStatsCluster} = state;
            return {
                nr: [
                    ...Object.keys(hourlyStatsRegion.nr),
                    ...Object.keys(hourlyStatsCluster.nr),
                ],
                lte: [
                    ...Object.keys(hourlyStatsRegion.lte),
                    ...Object.keys(hourlyStatsCluster.lte),
                ],
            };
        },
        kpiColumnsFlexHourly: (state) => {
            const {
                hourlyStatsRegionFlex,
                hourlyStatsClusterFlex
            } = state;
            return {
                nr: [
                    ...Object.keys(hourlyStatsRegionFlex.nr),
                    ...Object.keys(hourlyStatsClusterFlex.nr),
                ],
                lte: [
                    ...Object.keys(hourlyStatsRegionFlex.lte),
                    ...Object.keys(hourlyStatsClusterFlex.lte),
                ],
            };
        },
        clustersForSelectedRegion: (state) => {
            const {clusters, selectedRegion} = state;
            if (selectedRegion === 'ALL') {
                return clusters;
            }
            return clusters.filter(cluster => cluster.region === selectedRegion);
        },
        selectedClusterId: (state) => {
            const {selectedCluster} = state;
            return selectedCluster.cluster_id;
        },
        urlForPage: (state) => (kpiType, level, timeUnit) => {
            const {selectedRegion, selectedCluster, selectedTech, selectedCell, selectedClusterId} = state;
            const clusterId = selectedCluster.cluster_id;

            function getApiRouteForStandardKpi() {
                if (level === 'cluster') {
                    return timeUnit === 'daily' ? apiRoutes.dailyStatsCluster : apiRoutes.hourlyStatsCluster;
                }
                if (level === 'cell') {
                    return timeUnit === 'daily' ? apiRoutes.dailyStatsCell : apiRoutes.hourlyStatsCell;
                }
                return timeUnit === 'daily' ? apiRoutes.dailyStatsRegion : apiRoutes.hourlyStatsRegion;
            }

            function getApiRouteForFlexKpi() {
                if (level === 'cluster') {
                    return timeUnit === 'daily' ? apiRoutes.dailyStatsClusterFlex : apiRoutes.hourlyStatsClusterFlex;
                }
                if (level === 'cell') {
                    return timeUnit === 'daily' ? apiRoutes.dailyStatsCellFlex : apiRoutes.hourlyStatsCellFlex;
                }
                return timeUnit === 'daily' ? apiRoutes.dailyStatsRegionFlex : apiRoutes.hourlyStatsRegionFlex;
            }

            function getUrl() {
                const apiRoute = kpiType === 'standard' ? getApiRouteForStandardKpi() : getApiRouteForFlexKpi();
                if (level === 'cluster') {
                    return generateUrl(apiRoute, {
                        region: selectedRegion,
                        cluster: selectedClusterId,
                        tech: selectedTech,
                    });
                }
                if (level === 'cell') {
                    return generateUrl(apiRoute, {
                        region: selectedRegion,
                        cell: selectedCell[selectedTech],
                        tech: selectedTech,
                    });
                }
                return generateUrl(apiRoute, {
                    region: selectedRegion,
                    tech: selectedTech,
                });
            }

            return getUrl();

        },
        urlForDailyStatsRegion: (state) => {
            const {urlForPage} = state;
            return urlForPage('standard', 'region', 'daily');
        },
        // isSelectedCellInSelectedRegion: (state) => {
        //     const {selectedCell, selectedRegion, siteIdPrefixList} = state;
        //     const sitePrefixes = siteIdPrefixList.filter(prefix => prefix.region === selectedRegion);
        //     if (sitePrefixes.length === 0) {
        //         return {
        //             nr: false,
        //             lte: false,
        //         };
        //     }
        //     return {
        //         nr: sitePrefixes.some(prefix => selectedCell.nr.startsWith(prefix.siteId)),
        //         lte: sitePrefixes.some(prefix => selectedCell.lte.startsWith(prefix.siteId)),
        //     };
        // }

    }
});