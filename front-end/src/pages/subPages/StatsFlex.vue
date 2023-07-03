<script setup>

import {useApiArray} from "@/composables/api.js";
import {useQuasar} from 'quasar';
import {apiGet, apiRoutes} from "@/api/apiCalls.js";
import {computed, ref, watch} from "vue";
import {useMainStore} from "@/store/mainStore.js";
import {storeToRefs} from "pinia";
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
  level: {
    type: String,
    required: true,
    validator(value) {
      return ['cluster', 'region'].includes(value);
    }
  },
});

const mainStore = useMainStore();
const tab = ref('nr');
const {
  selectedRegion,
  selectedCluster,
  kpiColumnsFlex,
  kpiColumnsFlexHourly,
  kpiToExclude
} = storeToRefs(mainStore);

function getApiRoute() {
  if (props.level === 'cluster') {
    return props.timeUnit === 'daily' ? apiRoutes.dailyStatsClusterFlex : apiRoutes.hourlyStatsClusterFlex;
  }
  return props.timeUnit === 'daily' ? apiRoutes.dailyStatsRegionFlex : apiRoutes.hourlyStatsRegionFlex;
}

const apiRoute = getApiRoute();

const urlRef = computed(() => {
  if (props.level === 'cluster') {
    return generateUrl(apiRoute, {tech: tab.value, cluster: selectedCluster.value['cluster_id']});
  }
  return generateUrl(apiRoute, {tech: tab.value, region: selectedRegion.value});
});

const apiArray = [apiGet(urlRef)];

function setStoreData() {
  const {timeUnit, level} = props;
  const data = dataArray.at(0).value;

  const store = {
    daily: {
      region: mainStore.dailyStatsRegionFlex,
      cluster: mainStore.dailyStatsClusterFlex,
    },
    hourly: {
      region: mainStore.hourlyStatsRegionFlex,
      cluster: mainStore.hourlyStatsClusterFlex,
    },
  };

  const storeMeta = {
    daily: {
      region: mainStore.dailyStatsRegionFlexMeta,
      cluster: mainStore.dailyStatsClusterFlexMeta,
    },
    hourly: {
      region: mainStore.hourlyStatsRegionFlexMeta,
      cluster: mainStore.hourlyStatsClusterFlexMeta,
    },
  };

  if (store[timeUnit] && store[timeUnit][level]) {

    const targetStore = store[timeUnit][level];
    targetStore[tab.value] = data.data;

    const targetStoreMeta = storeMeta[timeUnit][level];
    targetStoreMeta[tab.value] = data.meta;

    return;

  }

  throw new Error('Invalid timeUnit or level in setStoreData');

}

const {
  isFetchingArray,
  errorArray,
  dataArray,
  isLoading,
  execute,
} = useApiArray(apiArray, () => {
  if (dataArray.length >= 1 && dataArray.at(0).value && dataArray.at(0).value.data) {
    setStoreData(0);
  }
});
const getStats = function (timeUnit, level) {
  const stats = {
    cluster: {
      hourly: storeToRefs(mainStore).hourlyStatsClusterFlex,
      daily: storeToRefs(mainStore).dailyStatsClusterFlex,
    },
    region: {
      hourly: storeToRefs(mainStore).hourlyStatsRegionFlex,
      daily: storeToRefs(mainStore).dailyStatsRegionFlex,
    },
  };
  if (stats[level] && stats[level][timeUnit]) {
    return stats[level][timeUnit];
  }
  throw new Error('Invalid timeUnit or level');
};
const getKpiColumns = function (timeUnit) {
  if (timeUnit === 'daily') {
    return kpiColumnsFlex;
  }
  if (timeUnit === 'hourly') {
    return kpiColumnsFlexHourly;
  }
};

const statsData = getStats(props.timeUnit, props.level);
const kpiColumns = getKpiColumns(props.timeUnit);

const $q = useQuasar();

watch(isLoading, () => {
  if (isLoading.value) {
    $q.loading.show({});
    return;
  }
  $q.loading.hide();
});


const {regionsArray} = storeToRefs(mainStore);

watch(() => urlRef.value, () => {
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
          <q-intersection
              v-for="kpiColumn in kpiColumns['nr'].filter(k=>kpiToExclude.indexOf(k)===-1)"
              :key="`flex-${tab}-${kpiColumn}`"
              :class="chartSizeClass.value"
              style="border: 1px blue solid;"
          >
            <e-chart-line-multi
                :data="statsData['nr'][kpiColumn]"
                :kpiColumn="kpiColumn"
                :time-unit="timeUnit"
                :color-mapping="colorMapping"
            />
          </q-intersection>
        </div>
      </q-tab-panel>

      <q-tab-panel name="lte">
        <div class="row">
          <q-intersection
              v-for="kpiColumn in kpiColumns['lte']"
              :key="`flex-${tab}-${kpiColumn}`"
              :class="chartSizeClass.value"
              style="border: 1px blue solid;"
          >
            <e-chart-line-multi
                :data="statsData['lte'][kpiColumn]"
                :kpiColumn="kpiColumn"
                :time-unit="timeUnit"
                :color-mapping="colorMapping"
            />
          </q-intersection>
        </div>
      </q-tab-panel>

    </q-tab-panels>
  </q-card>


</template>


<style scoped>

</style>