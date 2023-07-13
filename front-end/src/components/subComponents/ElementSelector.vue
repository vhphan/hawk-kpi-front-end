<script setup>
import {computed, ref} from 'vue';
import {useMainStore} from "@/store/mainStore.js";
import {storeToRefs} from "pinia";
import {apiGet} from "@/api/apiCalls.js";
import {debounce} from "quasar";
import {triggerInfo} from "@/utils/notifications.js";

const mainStore = useMainStore();
const emit = defineEmits(['newVal']);
const props = defineProps({
  tech: {
    type: String,
    required: true,
    validator(value) {
      return ['nr', 'lte'].includes(value);
    }
  },
  baseEndpoint: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  queryParam: {
    type: String,
    required: true,
  },
  fieldName: {
    type: String,
    required: true,
  },
  minNumberOfChars: {
    type: Number,
    default: 0,
  },
  initialVal: {
    type: String,
    default: '',
  },

});

const {
  selectedRegion,
} = storeToRefs(mainStore);

const elementPartial = ref('');

const endPoint = computed(() => {
  return `${props.baseEndpoint}?region=${selectedRegion.value}&tech=${props.tech}&${props.queryParam}=${elementPartial.value}`;
});

const {data, execute, isFetching} = apiGet(endPoint, {refetch: false});
const elementsList = ref([]);

const getElementsList = async () => {
  await execute();
  if (!data.value || !data.value.data || !data.value.data.length) {
    return [];
  }
  const results = data.value.data;
  return results.map(d => d[props.fieldName]);
};

const model = ref(props.initialVal);

const filterFn = debounce(async function (val, update, abort) {
  // call abort() at any time if you can't retrieve data
  console.log(val);
  console.log(elementsList.value);

  update(async () => {
    if (props.minNumberOfChars && props.minNumberOfChars > 0 && val.length < props.minNumberOfChars) {
      if (elementPartial.value.length){
        triggerInfo({
          message: `Current list filtered for prefix ${elementPartial.value}`,
        })
      }
      return;
    }
    elementPartial.value = val;
    elementsList.value = await getElementsList();
  });
}, 1500);

const abortFilterFn = function () {
  // console.log('delayed filter aborted')
};

const hint = computed(() => {
  if (props.minNumberOfChars && props.minNumberOfChars > 0) {
    return `Type at least ${props.minNumberOfChars} characters`;
  }
  return '';
});

const updateNewValue = (val) => {
  console.log('newValue', val);
  emit('newVal', val);
};

</script>


<template>
  <q-select
      filled
      v-model="model"
      use-input
      hide-selected
      fill-input
      input-debounce="0"
      :label="label"
      :options="elementsList"
      @filter="filterFn"
      @filter-abort="abortFilterFn"
      style="width: 250px"
      :hint="hint"
      :loading="isFetching"
      @update:model-value="val => updateNewValue(val)"
  >
    <template v-slot:no-option>
      <q-item>
        <q-item-section class="text-grey">
          No results
        </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>
