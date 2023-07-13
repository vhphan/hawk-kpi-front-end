<script setup>
import {useMainStore} from "@/store/mainStore.js";
import {storeToRefs} from "pinia";
import CellSelector from "@/components/subComponents/CellSelector.vue";
import {ref} from "vue";

const mainStore = useMainStore();
const {regionsArray} = mainStore;
const {selectedRegion} = storeToRefs(mainStore);
const tech = ref('nr');


</script>


<template>

  <div class="row">
    <q-select
        :options="regionsArray"
        v-model="selectedRegion"
        class="col-xs-12 col-md-6 col-lg-4 col-xl-3 q-mb-md"
        outlined
    />
    <div class="q-gutter-sm">
      <q-radio v-model="tech" val="nr" label="NR"/>
      <q-radio v-model="tech" val="lte" label="LTE"/>
    </div>

    <cell-selector :tech="tech"/>



  </div>

</template>


<style scoped>

</style>