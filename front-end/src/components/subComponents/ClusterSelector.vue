<script setup>

import {useMainStore} from "@/store/mainStore.js";
import {storeToRefs} from "pinia";
import {apiGet} from "@/api/apiCalls.js";
import {onMounted, watch} from "vue";

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
}

watch(selectedRegion, async () => {
  if (selectedCluster.region !== selectedRegion.value) {
    selectedCluster.value = null;
  }
});



</script>

<template>
  <q-select
      filled
      outlined
      v-model="selectedCluster"
      :options="clustersForSelectedRegion"
      label="Select Cluster"
      :loading="isFetching"
      option-label="cluster_id"
      option-value="cluster_id"
      @click="check"
  />
</template>

<style scoped>

</style>