<script setup>
import {computed, ref} from 'vue';
import {useMainStore} from "@/store/mainStore.js";
import {storeToRefs} from "pinia";
import {apiGet} from "@/api/apiCalls.js";

const mainStore = useMainStore();

const props = defineProps({
  tech: {
    type: String,
    required: true,
    validator(value) {
      return ['nr', 'lte'].includes(value);
    }
  },
});

const {
  selectedRegion,
} = storeToRefs(mainStore);

const cellPartial = ref('');

const endPoint = computed(() => {
  return `cellsList?region=${selectedRegion.value}&tech=${props.tech}&cellPartial=${cellPartial.value}`;
});

const {data, execute, isFetching} = apiGet(endPoint);
const cellsList = ref([]);
const getCellsList = async () => {
  await execute();
  if (!data.value || !data.value.data || !data.value.data.length) {
    return [];
  }
  const results = data.value.data;
  return results.map(d => d['cell_id']);
};

const model = ref(null);

const filterFn = async function (val, update, abort) {
  // call abort() at any time if you can't retrieve data somehow

  update(async () => {
    cellPartial.value = val;
    cellsList.value = await getCellsList();
  });


};

const abortFilterFn = function () {
  // console.log('delayed filter aborted')
};


</script>


<template>
  <div class="q-pa-md">
    <div class="q-gutter-md">

      <q-select
          filled
          v-model="model"
          hide-selected
          use-input
          fill-input
          input-debounce="0"
          label="Lazy filter"
          :options="cellsList"
          @filter="filterFn"
          @filter-abort="abortFilterFn"
          style="width: 250px"
          hint="hint"
          :loading="isFetching"
      >
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey">
              No results
            </q-item-section>
          </q-item>
        </template>
      </q-select>
    </div>
  </div>
</template>


<style scoped>

</style>