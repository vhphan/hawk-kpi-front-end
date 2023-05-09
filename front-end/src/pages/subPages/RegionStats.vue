<script setup>
import {useApiArray} from "@/composables/api.js";

const props = defineProps({
    timeUnit: {
        type: String,
        required: true,
        validator(value) {
            // The value must match one of these strings
            return ['daily', 'hourly'].includes(value);
        }
    },
});

import {apiGet, apiRoutes} from "@/api/apiCalls.js";
import {computed, onMounted, ref, watch} from "vue";
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

const apiRoute = props.timeUnit === 'daily' ? apiRoutes.dailyStatsRegion : apiRoutes.hourlyStatsRegion;

const generateUrl = function(url, params = {}) {
    const query = new URLSearchParams(params).toString();
    return url + '?' + query;
}

const urlRef = computed(()=>{
    return generateUrl(apiRoute, {tech: 'nr', region: selectedRegion.value});
});

const apiArray = techs.map(
    tech => apiGet(urlRef)
);

const {
    isFetchingArray,
    errorArray,
    dataArray,
    isLoading,
    execute,
} = useApiArray(apiArray, () => {
    techs.forEach((tech, index) => {
        if (dataArray.length >= index + 1 && dataArray.at(index).value && dataArray.at(index).value.data) {
            if (props.timeUnit === 'daily') {
                mainStore.saveDailyStatsRegion(dataArray.at(index).value.data, tech);


            }
            if (props.timeUnit === 'hourly') {
                mainStore.saveHourlyStatsRegion(dataArray.at(index).value.data, tech);


            }
        }
    });
});

// const {dailyStatsRegion} = storeToRefs(mainStore);
// const statsRegion = props.timeUnit === 'daily' ? mainStore.dailyStatsRegion : mainStore.hourlyStatsRegion;
const getStats = function(timeUnit){
    if (timeUnit === 'daily') {
        return storeToRefs(mainStore).dailyStatsRegion;
    }
    if (timeUnit === 'hourly') {
        return storeToRefs(mainStore).hourlyStatsRegion;
    }
}

const statsRegion = getStats(props.timeUnit);

onMounted(() => {
});

const tab = ref('nr');

const {regionsArray} = storeToRefs(mainStore);

watch(selectedRegion, () => {
    execute && execute().then(() => {
        console.log(`Executed for ${selectedRegion.value}`);
    });
}, {immediate: true});


</script>


<template>
    <q-spinner v-if="isLoading"/>
    <div class="row">
        <q-select
            :options="regionsArray"
            v-model="selectedRegion"
            class="col-xs-12 col-md-6 col-lg-4 col-xl-3"
        />
    </div>
    <q-card>
        <q-tabs
            v-model="tab"
            dense
            class="text-grey"
            active-color="primary"
            indicator-color="primary"
            align="justify"
            narrow-indicator
        >
            <q-tab name="nr" label="NR" />
            <q-tab name="lte" label="LTE" />
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="tab" animated>
            <q-tab-panel name="nr">
                <div class="row">
                    <q-card v-for="kpiColumn in kpiColumns['nr']" :key="kpiColumn" class="col-xs-12 col-md-6 col-lg-4 col-xl-3"
                            style="border: 1px blue solid;">
                        <e-chart-line
                            :data="statsRegion['nr'][kpiColumn]"
                            :kpiColumn="kpiColumn"
                            seriesName="nr"
                            :time-unit="timeUnit"
                            :region="selectedRegion"
                        />
                    </q-card>
                </div>
            </q-tab-panel>

            <q-tab-panel name="lte">
                <div class="text-h6">COMING SOON</div>
                Work In Progress.
            </q-tab-panel>

        </q-tab-panels>
    </q-card>




</template>


<style scoped>

</style>