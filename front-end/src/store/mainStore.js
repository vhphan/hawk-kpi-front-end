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
        darkMode: useLocalStorage('darkMode', true),

        colorMapping: useLocalStorage('colorMapping', {
            'Maxis': '#72fa05',
            'Celcom': '#37ffd4',
            'Digi': '#eeff03',
            'UMobile': '#ffa600',
            'YTL': '#795E61',
            'TM': '#ff00ff',
        })

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
        }
    }
});