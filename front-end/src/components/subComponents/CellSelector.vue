<script setup>
import ElementSelector from "@/components/subComponents/ElementSelector.vue";
import {useMainStore} from "@/store/mainStore.js";
import {storeToRefs} from "pinia";
import {computed} from "vue";

const mainStore = useMainStore();
const {selectedCell} = storeToRefs(mainStore);

const props = defineProps({
  tech: {
    type: String,
    required: true,
    validator(value) {
      return ['nr', 'lte'].includes(value);
    }
  },
});

  const newValueReceived = (v) => {
    console.log('new value received', v);
    selectedCell.value[props.tech] = v;
  };

  const selectedCellVal = computed(() => {
    return selectedCell.value[props.tech];
  });

</script>

<template>
  <element-selector
      field-name="cell_id"
      query-param="cellPartial"
      label="Select Cell"
      base-endpoint="cellsList"
      :tech="tech"
      :minNumberOfChars="5"
      @new-val="newValueReceived"
      :initialVal="selectedCellVal"
  />
</template>