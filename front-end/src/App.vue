<template>
  <main-layout/>
</template>

<script setup>
import MainLayout from "@/layouts/MainLayout.vue";
import {onMounted} from "vue";
import {loadScript} from "@/utils/myFunctions.js";
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


onMounted(async () => {
  // if (/Edg/.test(navigator.userAgent)) {
  //     loadScript("http://localhost:8098", "vue-devtools", () => {
  //         console.log("vue-devtools loaded");
  //     });
  const {data, execute, isFetching} = apiGet(apiRoutes.kpiList);
  await execute();
  if (data.value && data.value.data && Object.keys(data.value.data).includes('kpiList') ) {
    kpiList.value = data.value.data.kpiList;
    kpiListFlex.value = data.value.data.kpiListFlex;
  }


});

</script>

<style>
</style>
