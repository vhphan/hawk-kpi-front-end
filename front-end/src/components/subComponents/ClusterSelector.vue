<script setup>

import {useMainStore} from "@/store/mainStore.js";
import {storeToRefs} from "pinia";
import {apiGet} from "@/api/apiCalls.js";
import {onMounted, ref, watch} from "vue";
import {triggerWarning} from "@/utils/notifications.js";

const mainStore = useMainStore();

const {
  clusters,
  clustersForSelectedRegion,
  selectedCluster,
  selectedRegion,
} = storeToRefs(mainStore);

const {data, execute, isFetching} = apiGet('clustersList');

async function getClustersList() {
  await execute();
  clusters.value = data.value.data;
}

onMounted(async () => {
  await getClustersList();
});

const check = async () => {
  if (clustersForSelectedRegion.value.length === 0) {
    await getClustersList();
  }
};

watch(selectedRegion, async () => {
  if (selectedCluster.region !== selectedRegion.value) {
    selectedCluster.value = null;
  }
});

const options = ref([]);
options.value = clustersForSelectedRegion.value;
const filterFn = function (val, update, abort) {
  update(() => {

    const needle = val.toLowerCase();
    // if (needle === '' || needle.length < 2) {
    //   return;
    // }
    options.value = clustersForSelectedRegion.value.filter(v => {
      // if (v === null) {
      //   return false;
      // }
      return v['cluster_id'].toLowerCase().indexOf(needle) > -1;
    });
  });
}

const setModel = function(val) {
  selectedCluster.value = val
}

onMounted(() => {
  if (!selectedCluster.value['cluster_id']) {
    triggerWarning({
      message: 'Please select a cluster',
      caption: 'No cluster selected',
      position: 'center',
    })
  }
});

</script>

<template>
  <q-select
      filled
      v-model="selectedCluster"
      use-input
      hide-selected
      fill-input
      option-label="cluster_id"
      option-value="cluster_id"
      input-debounce="0"
      :options="options"
      @filter="filterFn"
      :loading="isFetching"
  >
    <template v-slot:no-option>
      <q-item>
        <q-item-section class="text-grey">
          No results
        </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>

<style scoped>

</style>