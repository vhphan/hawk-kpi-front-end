<script setup>

import {apiGet, apiRoutes} from "@/api/apiCalls.js";
import {computed, onMounted, ref} from "vue";
import {useMainStore} from "@/store/mainStore.js";
import {storeToRefs} from "pinia";
import {triggerNegative} from "@/utils/notifications.js";
import EChartLine from "@/components/EChartLine.vue";

// const {data, execute, isFetching} = apiGet(apiRoutes.dailyStatsRegion, {
//     tech: 'nr'
// });
const mainStore = useMainStore();

const techs = [
    'nr',
    // 'lte'
];

const {
    selectedRegion,
    kpiColumns
} = storeToRefs(mainStore);
const apiArray = techs.map(
    tech => apiGet(apiRoutes.dailyStatsRegion, {tech, region: selectedRegion.value})
);
const isFetchingArray = apiArray.map((api) => api.isFetching);
const errorArray = apiArray.map((api) => api.error);
const dataArray = apiArray.map((api) => api.data);

const isLoading = computed(() => {
    return isFetchingArray.some((isFetching) => isFetching.value);
});

const execute = async () => {
    const executePromisesArray = apiArray.map((api) => api.execute());
    await Promise.all(executePromisesArray);
    errorArray.forEach((error) => {
        if (error.value) {
            triggerNegative({message: error.value});
        }
    });
    techs.forEach((tech, index) => {
        if (dataArray.length >= index + 1) {
            mainStore.saveDailyStatsRegion(dataArray.at(index).value.data, tech);
        }
    });
};

const {dailyStatsRegion} = storeToRefs(mainStore);

onMounted(() => {
    execute().then(() => console.log('Executed'));
});

</script>


<template>
    <div>Page1</div>
    <q-spinner v-if="isLoading"/>

    <div class="row" v-for="tech in techs" :key="tech">
        <q-toolbar >{{ tech }}</q-toolbar>
        <q-card v-for="kpiColumn in kpiColumns[tech]" :key="kpiColumn" class="col-3">
            <e-chart-line
                    :data="dailyStatsRegion[tech][kpiColumn]"
                    :kpiColumn="kpiColumn"
                    :seriesName="tech"
                    time-unit="daily"
            />
        </q-card>
    </div>


</template>


<style scoped>

</style>