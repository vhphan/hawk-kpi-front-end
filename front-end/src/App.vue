<template>
  <main-layout/>
</template>

<script setup>
import MainLayout from "@/layouts/MainLayout.vue";
import {onMounted, watch} from "vue";
import {useMainStore} from "@/store/mainStore.js";
import {storeToRefs} from "pinia";
import {apiGet, apiRoutes} from "@/api/apiCalls.js";

const store = useMainStore();
const storeVersion = store.version;
const version = __APP_VERSION__;

if (version !== storeVersion) {
  localStorage.clear();
  store.version = version;
}

const {kpiList, kpiListFlex} = storeToRefs(store);

// if (/Edg/.test(navigator.userAgent)) {
//     loadScript("http://localhost:8098", "vue-devtools", () => {
//         console.log("vue-devtools loaded");
//     });

onMounted(async () => {
  const {data, execute, isFetching} = apiGet(apiRoutes.kpiList);
  await execute();
  if (data.value && data.value.data && Object.keys(data.value.data).includes('kpiList')) {
    kpiList.value = data.value.data.kpiList;
    kpiListFlex.value = data.value.data.kpiListFlex;
  }
});

onMounted(async () => {
  await store.getSiteIdPrefixList();
});

watch(() => store.selectedRegion, async (newVal, oldVal) => {
  if (newVal !== oldVal) {
    store.selectedCell = {
      nr: null,
      lte: null,
    };
  }
});

</script>

<style>
</style>
