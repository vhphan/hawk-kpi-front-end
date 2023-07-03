<script setup>
import WorkInProgress from "@/pages/subPages/WorkInProgress.vue";
import ClusterStats from "@/pages/subPages/ClusterStats.vue";

const isProduction = import.meta.env.PROD;


</script>

<template>

  <!--  <work-in-progress v-if="isProduction"/>-->
  <!--  <cluster-stats v-else time-unit="daily"/>-->
  <cluster-stats time-unit="hourly" />

</template>

<style scoped>

</style>