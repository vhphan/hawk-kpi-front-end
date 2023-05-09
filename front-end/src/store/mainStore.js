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
    }
});