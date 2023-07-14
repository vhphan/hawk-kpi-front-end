<script setup>
import {useApiArray} from "@/composables/api.js";
import {debounce, useQuasar} from 'quasar';
import {apiGet, apiRoutes} from "@/api/apiCalls.js";
import {computed, onMounted, onUpdated, ref, watch} from "vue";
import {useMainStore} from "@/store/mainStore.js";
import {storeToRefs} from "pinia";
import EChartLine from "@/components/EChartLine.vue";
import {generateUrl, getTimestamp} from "@/utils/myFunctions.js";
import ClusterSelector from "@/components/subComponents/ClusterSelector.vue";
import CellSelector from "@/components/subComponents/CellSelector.vue";
import {triggerWarning} from "@/utils/notifications.js";
import {apiAx} from "@/plugins/httpAx.js";

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
      return ['cluster', 'region', 'cell', 'site'].includes(value);
    }
  },
});

const mainStore = useMainStore();
const {selectedTech: tab} = storeToRefs(mainStore);
const {
  selectedRegion,
  selectedClusterId,
  selectedCell,
  urlForDailyStatsRegion
} = storeToRefs(mainStore);

const urlRef = computed(() =>
    mainStore.urlForPage('standard', props.level, props.timeUnit)
);

const getMetaData = function () {
  const metaData = {
    daily: {
      region: mainStore.dailyStatsRegionMeta,
      cluster: mainStore.dailyStatsClusterMeta,
      cell: mainStore.dailyStatsCellMeta,
    },
    hourly: {
      region: mainStore.hourlyStatsRegionMeta,
      cluster: mainStore.hourlyStatsClusterMeta,
      cell: mainStore.hourlyStatsCellMeta,
    },
  };
  if (metaData[props.timeUnit] && metaData[props.timeUnit][props.level]) {
    return metaData[props.timeUnit][props.level];
  }
  throw new Error('Invalid timeUnit or level');
};

const storeMeta = getMetaData();

function setStoreData(responseData) {
  console.log('setStoreData');
  const {timeUnit, level} = props;
  if (!responseData) {
    console.log('No data');
    return;
  }
  if (statsData && Object.keys(statsData).includes('nr') && Object.keys(statsData).includes('lte')) {
    statsData[tab.value] = responseData.data;
    storeMeta[tab.value] = responseData.meta;
    updateTimeInSeconds.value = getTimestamp();
    return;
  }
  console.log(statsData.value);
  throw new Error('Invalid timeUnit or level in setStoreData');
}

function clearStoreData() {
  console.log('clearStoreData');
  const {timeUnit, level} = props;
  const storeMeta = getMetaData();
  triggerWarning({
    message: 'Invalid or No Selection. Select a valid option.'
  });
  if (statsData && Object.keys(statsData).includes('nr') && Object.keys(statsData).includes('lte')) {
    statsData[tab.value] = [];
    storeMeta[tab.value] = {};
    return;
  }
  console.log(statsData.value);
  throw new Error('Invalid timeUnit or level in clearStoreData');
}

const updateTimeInSeconds = ref(getTimestamp());

const kpiColumns = storeToRefs(mainStore).kpiList;

const statsStoreLookup = {
  cluster: {
    hourly: mainStore.hourlyStatsCluster,
    daily: mainStore.dailyStatsCluster,
  },
  region: {
    hourly: mainStore.hourlyStatsRegion,
    daily: mainStore.dailyStatsRegion,
  },
  cell: {
    hourly: mainStore.hourlyStatsCell,
    daily: mainStore.dailyStatsCell,
  },
};

const statsData = statsStoreLookup[props.level][props.timeUnit];

const $q = useQuasar();


const {regionsArray} = storeToRefs(mainStore);


onMounted(() => {
  console.log('onMounted');
});

onUpdated(() => {
  console.log('onUpdated');
});

const myFetch = apiAx();
const isLoading = ref(false);
const fetchData = async function () {
  console.log('fetchData');
  isLoading.value = true;
  const response = await myFetch.get(urlRef.value);
  isLoading.value = false;
  const {timeUnit, level} = props;
  if (response.status === 200) {
    setStoreData(response.data);
    return;
  }
  clearStoreData();
};

watch(isLoading, (newValue, oldValue) => {
  console.log('isLoading changed');
  if (isLoading.value) {
    $q.loading.show({});
    return;
  }
  $q.loading.hide();
});

watch(urlRef, (newValue, oldValue) => {
  console.log('urlRef changed');
  fetchData();
});

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
        v-if="level === 'cluster'"
        class="col-xs-12 col-md-6 col-lg-4 col-xl-3 q-mb-md"
        outlined
    />
    <cell-selector
        v-if="level === 'cell'"
        :tech="tab"
        class="col-xs-12 col-md-6 col-lg-4 col-xl-3 q-mb-md"
        outlined
    />
    <div class="col q-pl-md q-pt-md" v-if="storeMeta[tab] && storeMeta[tab]['time']">
      <span>Data Fetched @: {{ new Date(storeMeta[tab]['time']) }}, &nbsp</span>

      <span>Tech: {{ storeMeta[tab]['tech'].toUpperCase() }}, &nbsp</span>

      <span v-if="storeMeta[tab]['region'] && level==='region'">Region: {{ storeMeta[tab]['region'] }}, &nbsp</span>

      <span v-if="storeMeta[tab]['cell'] && level==='cell'">
        {{ storeMeta[tab]['cell'] }}, &nbsp
      </span>

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
              v-for="(kpiColumn, i) in kpiColumns[tech]"
              class="col-xs-12 col-md-6 col-lg-4 col-xl-3"
              style="border: 1px blue solid;"
          >
            <e-chart-line
                v-if="statsData[tech][kpiColumn] && !isLoading"

                :data="statsData[tech][kpiColumn]"
                :kpiColumn="kpiColumn"
                :seriesName="tech"
                :time-unit="timeUnit"
                :region="selectedRegion"
                :id="i"
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