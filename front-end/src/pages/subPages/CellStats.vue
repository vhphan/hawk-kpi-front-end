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

    <cell-selector/>


    <!--        <div class="col q-pl-md q-pt-md" v-if="regionMetaData[tab]['time']">-->
    <!--            <span>Data Fetched @: {{ new Date(regionMetaData[tab]['time']) }}, &nbsp</span>-->
    <!--            <span>Region: {{ regionMetaData[tab]['region'] }}, &nbsp</span>-->
    <!--            <span>Tech: {{ regionMetaData[tab]['tech'].toUpperCase() }}, &nbsp</span>-->
    <!--        </div>-->

  </div>

</template>


<style scoped>

</style>