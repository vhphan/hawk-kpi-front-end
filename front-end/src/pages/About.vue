<script setup>
const appBuild = __APP_BUILD__;

</script>

<template>
  <q-card bordered>
    <q-card-section >
      <h5>About</h5>
      <p>KPI dashboard.</p>
    </q-card-section>
    <q-separator />
    <q-card-section >
      <div>Version 0.1, Build: {{ appBuild }}</div>
      <div class="q-mt-md"
           style="font-size: 20px;">

        support/bug report: vee.huen.phan@ericsson.com
      </div>
      <div>
        &copy; 2023
      </div>


    </q-card-section>
  </q-card>
</template>

<style scoped>

</style>