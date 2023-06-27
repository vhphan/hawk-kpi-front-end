<script setup>

import CellStats from "@/pages/subPages/CellStats.vue";
import WorkInProgress from "@/pages/subPages/WorkInProgress.vue";

const isProduction = import.meta.env.PROD;


</script>

<template>
  <work-in-progress v-if="isProduction"/>
  <cell-stats v-else/>
</template>

<style scoped>

</style>