<script setup>

import {computed, onMounted, ref, watch} from "vue";
import ClusterSelector from "@/components/subComponents/ClusterSelector.vue";
import RegionSelector from "@/components/subComponents/RegionSelector.vue";
import {storeToRefs} from "pinia";
import {useMainStore} from "@/store/mainStore.js";
import EChartLine from "@/components/EChartLine.vue";
import {apiGet, apiRoutes} from "@/api/apiCalls.js";
import {useQuasar} from "quasar";
import {generateUrl} from "@/utils/myFunctions.js";
import {useApiArray} from "@/composables/api.js";
import {triggerNegative, triggerWarning} from "@/utils/notifications.js";
import WorkInProgress from "@/pages/subPages/WorkInProgress.vue";

const mainStore = useMainStore();
const tab = storeToRefs(mainStore).selectedTech;
const {
  selectedRegion,
  selectedCluster,
} = storeToRefs(mainStore);

const props = defineProps({
  timeUnit: {
    type: String,
    required: true,
    validator(value) {
      return ['daily', 'hourly'].includes(value);
    }
  },
});

const kpiColumns = computed(() => {
  if (props.timeUnit === 'daily') {
    return mainStore.kpiColumns;
  }
  if (props.timeUnit === 'hourly') {
    return mainStore.kpiColumnsHourly;
  }
});

const apiRoute = props.timeUnit === 'daily' ? apiRoutes.dailyStatsCluster : apiRoutes.hourlyStatsCluster;

const urlRef = computed(() => {
  if (!selectedCluster.value || !selectedCluster.value['cluster_id']) {
    triggerWarning({
      message: 'Please select a cluster',
      caption: 'No cluster selected',
      position: 'center',
    });
  }
  return generateUrl(apiRoute, {tech: tab.value, cluster: !selectedCluster.value? 'null' : selectedCluster.value['cluster_id']});
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
      mainStore.dailyStatsCluster[tab.value] = dataArray.at(index).value.data;
      mainStore.dailyStatsClusterMeta[tab.value] = dataArray.at(index).value.meta;
    }
    if (props.timeUnit === 'hourly') {
      mainStore.hourlyStatsCluster[tab.value] = dataArray.at(index).value.data;
      mainStore.hourlyStatsClusterMeta[tab.value] = dataArray.at(index).value.meta;
    }
  }
});

const getStats = function (timeUnit) {
  if (timeUnit === 'daily') {
    return storeToRefs(mainStore).dailyStatsCluster;
  }
  if (timeUnit === 'hourly') {
    return storeToRefs(mainStore).hourlyStatsCluster
  }
};

const statsCluster = getStats(props.timeUnit);

const getClusterMetaData = function () {
  if (props.timeUnit === 'daily') {
    return storeToRefs(mainStore).dailyStatsClusterMeta;
  }
  if (props.timeUnit === 'hourly') {
    return storeToRefs(mainStore).hourlyStatsClusterMeta;
  }
};

const clusterMetaData = getClusterMetaData();


const $q = useQuasar();

watch(isLoading, () => {
  if (isLoading.value) {
    $q.loading.show({});
    return;
  }
  $q.loading.hide();
});

watch(()=> urlRef.value, () => {

  if (!selectedCluster.value || !selectedCluster.value['cluster_id']) {
    return;
  }
  execute && execute().then(() => {
    console.log(`Executed for ${selectedCluster.value['cluster_id']} and ${tab.value}`);


  });
}, {immediate: true});

</script>

<template>

  <div class="row">
    <region-selector class="col-xs-12 col-md-6 col-lg-4 col-xl-3 select-border"/>
    <cluster-selector class="col-xs-12 col-md-6 col-lg-4 col-xl-3 select-border"/>
  </div>

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
            v-for="kpiColumn in kpiColumns['nr']" :key="`${tab}-${kpiColumn}`"
            class="col-xs-12 col-md-6 col-lg-4 col-xl-3"
            style="border: 1px blue solid;"
        >
          <e-chart-line
              :data="statsCluster['nr'][kpiColumn]"
              :kpiColumn="kpiColumn"
              seriesName="nr"
              :time-unit="timeUnit"
          />
        </q-intersection>
      </div>
    </q-tab-panel>

    <q-tab-panel name="lte">
      <div
          class="row"
      >
        <q-intersection
            v-for="kpiColumn in kpiColumns['lte']"
            :key="`${tab}-${kpiColumn}`"
            class="col-xs-12 col-md-6 col-lg-4 col-xl-3"
            style="border: 1px blue solid;"
        >
          <e-chart-line
              :data="statsCluster['lte'][kpiColumn]"
              :kpiColumn="kpiColumn"
              seriesName="lte"
              :time-unit="timeUnit"
              :region="selectedRegion"
          />
        </q-intersection>
      </div>
    </q-tab-panel>

  </q-tab-panels>


</template>

<style scoped>
.select-border {
  border: 1px solid #583bff;
  border-radius: 4px;
  padding: 1px;
  margin: 1px;
}
</style>