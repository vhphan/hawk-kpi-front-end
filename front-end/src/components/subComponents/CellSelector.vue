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
  return `cellsList?region=${selectedRegion.value}&tech=${props.tech}&cellPartial=${cellPartial.value}}`;
});

const cellList = computed(() => {
  const {data, execute, isFetching} = apiGet(endPoint);
  execute();
  return data.map(d => d['cell_id']);
});

const options = ref([]);
const model = ref(null);

const filterFn = function (val, update, abort) {
  // call abort() at any time if you can't retrieve data somehow

  setTimeout(() => {
    update(() => {
      cellPartial.value = val;
      options.value = cellList.value;
    });
  }, 100);
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
          use-input
          hide-selected
          fill-input
          input-debounce="0"
          label="Lazy filter"
          :options="options"
          @filter="filterFn"
          @filter-abort="abortFilterFn"
          style="width: 250px"
          hint="With hide-selected and fill-input"
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