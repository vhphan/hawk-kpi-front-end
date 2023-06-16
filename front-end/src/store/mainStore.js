import {defineStore} from 'pinia';
import {useLocalStorage} from "@vueuse/core";

export const useMainStore = defineStore({
    id: 'mainStore',
    state: () => ({

        dailyStatsRegion: useLocalStorage('dailyStatsRegion', {
            nr: {},
            lte: {},
        }),

        hourlyStatsRegion: useLocalStorage('hourlyStatsRegion', {
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

        dailyStatsRegionFlex: useLocalStorage('dailyStatsRegion', {
            nr: {},
            lte: {},
        }),

        hourlyStatsRegionFlex: useLocalStorage('hourlyStatsRegion', {
                nr: {},
                lte: {},
            }
        ),

        dailyStatsRegionFlexMeta: useLocalStorage('dailyStatsRegionMeta', {
                nr: {},
                lte: {},
            }
        ),

        hourlyStatsRegionFlexMeta: useLocalStorage('hourlyStatsRegionMeta', {
                nr: {},
                lte: {},
            }
        ),

        regionsArray: [
            'ALL',
            'CENTRAL',
            'EASTERN',
            'NORTHERN',
            'SOUTHERN',
            'SABAH',
            'SARAWAK',
        ],

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

        selectedCell: useLocalStorage('selectedCell', null),

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

    }),
    actions: {
        saveDailyStatsRegion(data, tech) {
            this.dailyStatsRegion[tech] = data;
        },
        saveHourlyStatsRegion(data, tech) {
            this.hourlyStatsRegion[tech] = data;
        }
    },
    getters: {
        kpiColumns: (state) => {
            const {dailyStatsRegion} = state;
            return {
                nr: Object.keys(dailyStatsRegion.nr),
                lte: Object.keys(dailyStatsRegion.lte),
            };
        },
        kpiColumnsFlex: (state) => {
            const {dailyStatsRegionFlex} = state;
            return {
                nr: Object.keys(dailyStatsRegionFlex.nr),
                lte: Object.keys(dailyStatsRegionFlex.lte),
            };
        },
        kpiColumnsHourly: (state) => {
            const {hourlyStatsRegion} = state;
            return {
                nr: Object.keys(hourlyStatsRegion.nr),
                lte: Object.keys(hourlyStatsRegion.lte),
            };
        },
        kpiColumnsFlexHourly: (state) => {
            const {hourlyStatsRegionFlex} = state;
            return {
                nr: Object.keys(hourlyStatsRegionFlex.nr),
                lte: Object.keys(hourlyStatsRegionFlex.lte),
            };
        }
    }
});