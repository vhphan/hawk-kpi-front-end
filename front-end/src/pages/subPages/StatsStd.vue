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

function setStoreData() {
  console.log('setStoreData');
  const {timeUnit, level} = props;
  const data = dataArray.at(0).value;
  if (!data) {
    console.log('No data');
    return;
  }
  const storeMeta = getMetaData();

  if (statsData && Object.keys(statsData).includes('nr') && Object.keys(statsData).includes('lte')) {
    statsData[tab.value] = data.data;
    storeMeta[tab.value] = data.meta;
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

const {
  isFetchingArray,
  errorArray,
  dataArray,
  isLoading,
  execute,
} = useApiArray([apiGet(urlRef)],
    () => {
      console.log(`Executed for ${props.timeUnit} and ${props.level} with ${urlRef.value}`);
      // setStoreData();
    }
);

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

const metaData = getMetaData();

onMounted(() => {
  console.log('onMounted');
});

onUpdated(() => {
  console.log('onUpdated');
});

watch(isLoading, (newValue, oldValue) => {
  if (isLoading.value) {
    $q.loading.show({});
    return;
  }
  $q.loading.hide();

  if (urlRef.value.includes('null') || urlRef.value.includes('undefined')) {
    clearStoreData();
    return;
  }
  setStoreData();
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
    <div class="col q-pl-md q-pt-md" v-if="metaData[tab] && metaData[tab]['time']">
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
              v-for="(kpiColumn, i) in kpiColumns[tech]"
              class="col-xs-12 col-md-6 col-lg-4 col-xl-3"
              style="border: 1px blue solid;"
          >
            <e-chart-line
                v-if="statsData[tech][kpiColumn]"
                :key="`${tab}-${kpiColumn}-${level}-${timeUnit}-${i}}`"
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