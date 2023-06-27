<script setup>
import {useMainStore} from "@/store/mainStore.js";
import {storeToRefs} from "pinia";

const mainStore = useMainStore();

const {
  regionsArray,
  selectedRegion,
} = storeToRefs(mainStore);


</script>

<template>

  <q-select
      filled
      outlined
      v-model="selectedRegion"
      :options="regionsArray"
      label="Select Region"
  />

</template>

<style scoped>

</style>