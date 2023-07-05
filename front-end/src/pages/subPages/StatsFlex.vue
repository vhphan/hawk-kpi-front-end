<script setup>

import {useApiArray} from "@/composables/api.js";
import {useQuasar} from 'quasar';
import {apiGet, apiRoutes} from "@/api/apiCalls.js";
import {computed, ref, watch} from "vue";
import {useMainStore} from "@/store/mainStore.js";
import {storeToRefs} from "pinia";
import {generateUrl} from "@/utils/myFunctions.js";
import EChartLineMulti from "@/components/EChartLineMulti.vue";
import ClusterSelector from "@/components/subComponents/ClusterSelector.vue";

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

const apiRoute = computed(() => {
  if (props.level === 'cluster') {
    return props.timeUnit === 'daily' ? apiRoutes.dailyStatsClusterFlex : apiRoutes.hourlyStatsClusterFlex;
  }
  return props.timeUnit === 'daily' ? apiRoutes.dailyStatsRegionFlex : apiRoutes.hourlyStatsRegionFlex;
});

const urlRef = computed(() => {
  if (props.level === 'cluster' && (!selectedCluster.value || !selectedCluster.value['cluster_id'])) {
    return '';
  }
    if (props.level === 'cluster') {
    return generateUrl(apiRoute.value, {tech: tab.value, cluster: selectedCluster.value['cluster_id']});
  }
  return generateUrl(apiRoute.value, {tech: tab.value, region: selectedRegion.value});
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

    // refresh the charts


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
    setStoreData();
  }
});

const getKpiColumns = function (timeUnit) {
  if (timeUnit === 'daily') {
    return kpiColumnsFlex;
  }
  if (timeUnit === 'hourly') {
    return kpiColumnsFlexHourly;
  }
};

const statsData = computed(() => {
  const {timeUnit, level} = props;
  const stats = {
    cluster: {
      hourly: mainStore.hourlyStatsClusterFlex,
      daily: mainStore.dailyStatsClusterFlex,
    },
    region: {
      hourly: mainStore.hourlyStatsRegionFlex,
      daily: mainStore.dailyStatsRegionFlex,
    },
  };
  if (stats[level] && stats[level][timeUnit]) {
    return stats[level][timeUnit];
  }
  throw new Error('Invalid timeUnit or level');
});

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

  if (urlRef.value.length === 0) {
    return;
  }

  if (props.level === 'cluster' && (!selectedCluster.value || !selectedCluster.value['cluster_id'])) {
    return;
  }
  execute && execute().then(() => {
    console.log(`Executed for ${selectedRegion.value} and ${selectedCluster.value['cluster_id']}`);
  });
}, {immediate: true});

const getRegionMetaData = function () {
  const metaData = {
    daily: {
      region: mainStore.dailyStatsRegionFlexMeta,
      cluster: mainStore.dailyStatsClusterFlexMeta,
    },
    hourly: {
      region: mainStore.hourlyStatsRegionFlexMeta,
      cluster: mainStore.hourlyStatsClusterFlexMeta,
    },
  };
  if (metaData[props.timeUnit] && metaData[props.timeUnit][props.level]) {
    return metaData[props.timeUnit][props.level];
  }
  throw new Error('Invalid timeUnit or level');
};

const metaData = getRegionMetaData();

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
    <cluster-selector
        v-if="props.level === 'cluster'"
        class="col-xs-12 col-md-6 col-lg-4 col-xl-3 q-mb-md"
        outlined
    />
    <div class="col q-pl-md q-pt-md" v-if="metaData[tab]['time']">
      <span>Data Fetched @: {{ new Date(metaData[tab]['time']) }}, &nbsp</span>
      <span>Region: {{ metaData[tab]['region'] }}, &nbsp</span>
      <span>Tech: {{ metaData[tab]['tech'].toUpperCase() }}, &nbsp</span>
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


      <q-tab-panel v-for="tech in ['nr', 'lte']" :name="tech">
        <div class="row">
          <q-intersection
              v-for="kpiColumn in kpiColumns[tech].filter(k=>kpiToExclude.indexOf(k)===-1)"
              :key="`flex-${tab}-${kpiColumn}-${level}-${timeUnit}`"
              :class="chartSizeClass.value"
              style="border: 1px blue solid;"
          >
            <e-chart-line-multi
                v-if="statsData[tech][kpiColumn]"
                :data="statsData[tech][kpiColumn]"
                :kpiColumn="kpiColumn"
                :time-unit="timeUnit"
                :color-mapping="colorMapping"
            />
<!--            <q-card v-else>-->
<!--              <q-card-section>-->
<!--                <div class="text-h6">No Data for {{kpiColumn}}</div>-->
<!--              </q-card-section>-->
<!--            </q-card>-->
          </q-intersection>
        </div>
      </q-tab-panel>

    </q-tab-panels>
  </q-card>


</template>


<style scoped>

</style>