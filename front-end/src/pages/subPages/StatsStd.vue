<script setup>
import {useApiArray} from "@/composables/api.js";
import {useQuasar} from 'quasar';
import {apiGet, apiRoutes} from "@/api/apiCalls.js";
import {computed, watch} from "vue";
import {useMainStore} from "@/store/mainStore.js";
import {storeToRefs} from "pinia";
import EChartLine from "@/components/EChartLine.vue";
import {generateUrl} from "@/utils/myFunctions.js";
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
    default: 'region',
    validator(value) {
      return ['cluster', 'region'].includes(value);
    }
  },
});

// const {data, execute, isFetching} = apiGet(apiRoutes.dailyStatsRegion, {
//     tech: 'nr'
// });
const mainStore = useMainStore();

const tab = storeToRefs(mainStore).selectedTech;

const {
  selectedRegion,
  selectedCluster,
} = storeToRefs(mainStore);


const apiRoute = computed(() => {
  if (props.level === 'cluster') {
    return props.timeUnit === 'daily' ? apiRoutes.dailyStatsCluster : apiRoutes.hourlyStatsCluster;
  }
  return props.timeUnit === 'daily' ? apiRoutes.dailyStatsRegion : apiRoutes.hourlyStatsRegion;
});

const urlRef = computed(() => {
  console.log('urlRef computed');
  if (props.level === 'cluster' && (!selectedCluster.value || !selectedCluster.value['cluster_id'])) {
    return '';
  }
  return generateUrl(apiRoute.value, {
    tech: tab.value,
    region: selectedRegion.value,
    cluster: selectedCluster.value['cluster_id']
  });
});

const apiArray = [apiGet(urlRef)];

function setStoreData() {

  const {timeUnit, level} = props;
  const data = dataArray.at(0).value;

  const store = {
    daily: {
      region: mainStore.dailyStatsRegion,
      cluster: mainStore.dailyStatsCluster,
    },
    hourly: {
      region: mainStore.hourlyStatsRegion,
      cluster: mainStore.hourlyStatsCluster,
    },
  };

  const storeMeta = {
    daily: {
      region: mainStore.dailyStatsRegionMeta,
      cluster: mainStore.dailyStatsClusterMeta,
    },
    hourly: {
      region: mainStore.hourlyStatsRegionMeta,
      cluster: mainStore.hourlyStatsClusterMeta,
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
    setStoreData();
  }
});

const kpiColumns = computed(() => {
  if (props.timeUnit === 'daily') {
    return mainStore.kpiColumns;
  }
  if (props.timeUnit === 'hourly') {
    return mainStore.kpiColumnsHourly;
  }
});

const statsData = computed(() => {
  const stats = {
    cluster: {
      hourly: mainStore.hourlyStatsCluster,
      daily: mainStore.dailyStatsCluster,
    },
    region: {
      hourly: mainStore.hourlyStatsRegion,
      daily: mainStore.dailyStatsRegion,
    },
  };
  if (stats[props.level] && stats[props.level][props.timeUnit]) {
    return stats[props.level][props.timeUnit];
  }
  throw new Error('Invalid timeUnit or level');
});

const $q = useQuasar();

watch(isLoading, () => {
  if (isLoading.value) {
    $q.loading.show({});
    return;
  }
  $q.loading.hide();
});

const {regionsArray} = storeToRefs(mainStore);

function fetchDataFromServer() {
  console.log('watching urlRef.value triggered');

  if (urlRef.value.length === 0) {
    return;
  }
  if (props.level === 'cluster' && (!selectedCluster.value || !selectedCluster.value['cluster_id'])) {
    return;
  }

  execute && execute().then(() => {
    console.log(`Executed for ${selectedRegion.value} and ${selectedCluster.value['cluster_id']}`);
  });
}

watch(()=>urlRef.value, () => {
  fetchDataFromServer();
}, {immediate: true});

const getMetaData = function () {
  const metaData = {
    daily: {
      region: mainStore.dailyStatsRegionMeta,
      cluster: mainStore.dailyStatsClusterMeta,
    },
    hourly: {
      region: mainStore.hourlyStatsRegionMeta,
      cluster: mainStore.hourlyStatsClusterMeta,
    },
  };
  if (metaData[props.timeUnit] && metaData[props.timeUnit][props.level]) {
    return metaData[props.timeUnit][props.level];
  }
  throw new Error('Invalid timeUnit or level');
};

const metaData = getMetaData();


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

      <!--      <q-tab-panel name="nr">-->
      <!--        <div class="row">-->
      <!--          <q-intersection-->
      <!--              v-for="kpiColumn in kpiColumns['nr']"-->
      <!--              class="col-xs-12 col-md-6 col-lg-4 col-xl-3"-->
      <!--              style="border: 1px blue solid;"-->
      <!--          >-->
      <!--            <e-chart-line-->
      <!--                :key="`${tab}-${kpiColumn}-${level}-${timeUnit}`"-->
      <!--                :data="statsData['nr'][kpiColumn]"-->
      <!--                :kpiColumn="kpiColumn"-->
      <!--                seriesName="nr"-->
      <!--                :time-unit="timeUnit"-->
      <!--                :region="selectedRegion"-->
      <!--            />-->
      <!--          </q-intersection>-->
      <!--        </div>-->
      <!--      </q-tab-panel>-->

      <!--      <q-tab-panel name="lte">-->
      <!--        <div-->
      <!--            class="row"-->
      <!--        >-->
      <!--          <q-intersection-->
      <!--              v-for="kpiColumn in kpiColumns['lte']"-->
      <!--              class="col-xs-12 col-md-6 col-lg-4 col-xl-3"-->
      <!--              style="border: 1px blue solid;"-->
      <!--          >-->
      <!--            <e-chart-line-->
      <!--                :key="`${tab}-${kpiColumn}-${level}-${timeUnit}`"-->
      <!--                :data="statsData['lte'][kpiColumn]"-->
      <!--                :kpiColumn="kpiColumn"-->
      <!--                seriesName="lte"-->
      <!--                :time-unit="timeUnit"-->
      <!--            />-->
      <!--          </q-intersection>-->
      <!--        </div>-->
      <!--      </q-tab-panel>-->
      <!--      -->

        <q-tab-panel v-for="tech in ['nr', 'lte']" :name="tech">
          <div class="row">
            <q-intersection
                v-for="kpiColumn in kpiColumns[tech]"
                class="col-xs-12 col-md-6 col-lg-4 col-xl-3"
                style="border: 1px blue solid;"
            >
              <e-chart-line
                  v-if="statsData[tech][kpiColumn]"
                  :key="`${tab}-${kpiColumn}-${level}-${timeUnit}`"
                  :data="statsData[tech][kpiColumn]"
                  :kpiColumn="kpiColumn"
                  :seriesName="tech"
                  :time-unit="timeUnit"
                  :region="selectedRegion"
              />
<!--              <q-card v-else>-->
<!--                <q-card-section>-->
<!--                  <div class="text-h6">No Data for {{kpiColumn}}</div>-->
<!--                </q-card-section>-->
<!--              </q-card>-->
            </q-intersection>
          </div>
        </q-tab-panel>


    </q-tab-panels>

  </q-card>


</template>


<style scoped>

</style>