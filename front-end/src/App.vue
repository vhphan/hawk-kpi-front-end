<template>
  <main-layout/>
</template>

<script setup>
import MainLayout from "@/layouts/MainLayout.vue";
import {onMounted} from "vue";
import {loadScript} from "@/utils/myFunctions.js";
import {useMainStore} from "@/store/mainStore.js";

const store = useMainStore();
const storeVersion = store.version;
const version = __APP_VERSION__;

if (version !== storeVersion) {
  localStorage.clear();
  store.version = version;
}

onMounted(() => {
  // if (/Edg/.test(navigator.userAgent)) {
  //     loadScript("http://localhost:8098", "vue-devtools", () => {
  //         console.log("vue-devtools loaded");
  //     });
  // }

});

</script>

<style>
</style>
