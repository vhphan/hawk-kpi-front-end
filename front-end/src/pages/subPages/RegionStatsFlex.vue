<script setup>

import {useApiArray} from "@/composables/api.js";
import {useQuasar} from 'quasar';
import {apiGet, apiRoutes} from "@/api/apiCalls.js";
import {computed, onMounted, ref, watch} from "vue";
import {useMainStore} from "@/store/mainStore.js";
import {storeToRefs} from "pinia";
import {triggerNegative} from "@/utils/notifications.js";
import EChartLine from "@/components/EChartLine.vue";
import {generateUrl} from "@/utils/myFunctions.js";
import EChartLineMulti from "@/components/EChartLineMulti.vue";

const props = defineProps({
    timeUnit: {
        type: String,
        required: true,
        validator(value) {
            return ['daily', 'hourly'].includes(value);
        }
    },
});

const mainStore = useMainStore();
const tab = ref('nr');
const {
    selectedRegion,
    kpiColumnsFlex,
    kpiToExclude
} = storeToRefs(mainStore);
const apiRoute = props.timeUnit === 'daily' ? apiRoutes.dailyStatsRegionFlex : apiRoutes.hourlyStatsRegionFlex;
const urlRef = computed(() => {
    return generateUrl(apiRoute, {tech: tab.value, region: selectedRegion.value});
});
const apiArray = [apiGet(urlRef)];
const {
    isFetchingArray,
    errorArray,
    dataArray,
    isLoading,
    execute,
} = useApiArray(apiArray, () => {
    const index = 0;
    if (dataArray.length >= index + 1 && dataArray.at(index).value && dataArray.at(index).value.data) {
        if (props.timeUnit === 'daily') {
            mainStore.dailyStatsRegionFlex[tab.value] = dataArray.at(index).value.data;
            mainStore.dailyStatsRegionFlexMeta[tab.value] = dataArray.at(index).value.meta;
        }
        if (props.timeUnit === 'hourly') {
            mainStore.hourlyStatsRegionFlex[tab.value] = dataArray.at(index).value.data;
            mainStore.hourlyStatsRegionFlexMeta[tab.value] = dataArray.at(index).value.meta;
        }
    }
});
const getStats = function (timeUnit) {
    if (timeUnit === 'daily') {
        return storeToRefs(mainStore).dailyStatsRegionFlex;
    }
    if (timeUnit === 'hourly') {
        return storeToRefs(mainStore).hourlyStatsRegionFlex;
    }
};

const statsRegion = getStats(props.timeUnit);

const $q = useQuasar();

watch(isLoading, () => {
    if (isLoading.value) {
        $q.loading.show({});
        return;
    }
    $q.loading.hide();
});


const {regionsArray} = storeToRefs(mainStore);

watch([selectedRegion, tab], () => {
    execute && execute().then(() => {
        console.log(`Executed for ${selectedRegion.value}`);
    });
}, {immediate: true});

const getRegionMetaData = function () {
    if (props.timeUnit === 'daily') {
        return storeToRefs(mainStore).dailyStatsRegionFlexMeta;
    }
    if (props.timeUnit === 'hourly') {
        return storeToRefs(mainStore).hourlyStatsRegionFlexMeta;
    }
};

const regionMetaData = getRegionMetaData();

const {colorMapping, chartSizeClass} = storeToRefs(mainStore);




</script>


<template>

    <div class="row">
        <q-select
                :options="regionsArray"
                v-model="selectedRegion"
                class="col-xs-12 col-md-6 col-lg-4 col-xl-3 q-mb-md"
                outlined
        />
        <div class="col q-pl-md q-pt-md" v-if="regionMetaData[tab]['time']">
            <span>Data Fetched @: {{ new Date(regionMetaData[tab]['time']) }}, &nbsp</span>
            <span>Region: {{ regionMetaData[tab]['region'] }}, &nbsp</span>
            <span>Tech: {{ regionMetaData[tab]['tech'].toUpperCase() }}, &nbsp</span>
        </div>
    </div>
    <q-card>
        <q-tabs
                v-model="tab"
                dense
                class=""
                style="border: 1px solid #6a6af1;"
                active-color="primary"
                align="justify"
                narrow-indicator
                active-class="bg-primary text-white"
        >
            <q-tab name="nr" label="NR"/>
            <q-tab name="lte" label="LTE"/>
        </q-tabs>

        <q-separator/>

        <q-tab-panels v-model="tab" animated>

            <q-tab-panel name="nr">
                <div class="row">
                    <q-card
                            v-for="kpiColumn in kpiColumnsFlex['nr'].filter(k=>kpiToExclude.indexOf(k)===-1)" :key="`flex-${tab}-${kpiColumn}`"
                            :class="chartSizeClass.value"
                            style="border: 1px blue solid;"
                    >
                        <e-chart-line-multi
                                :data="statsRegion['nr'][kpiColumn]"
                                :kpiColumn="kpiColumn"
                                :time-unit="timeUnit"
                                :region="selectedRegion"
                                :color-mapping="colorMapping"

                        />
                    </q-card>
                </div>
            </q-tab-panel>

            <q-tab-panel name="lte">
                <div v-if="timeUnit==='daily'" class="row">
                    <q-card v-for="kpiColumn in kpiColumnsFlex['lte']" :key="`flex-${tab}-${kpiColumn}`"
                            :class="chartSizeClass.value"
                            style="border: 1px blue solid;"
                    >
                        <e-chart-line-multi
                                :data="statsRegion['lte'][kpiColumn]"
                                :kpiColumn="kpiColumn"
                                :time-unit="timeUnit"
                                :region="selectedRegion"
                                :color-mapping="colorMapping"
                        />

                    </q-card>
                </div>

                <div v-else class="text-h6">COMING SOON... Work In Progress.</div>

            </q-tab-panel>

        </q-tab-panels>
    </q-card>


</template>


<style scoped>

</style>