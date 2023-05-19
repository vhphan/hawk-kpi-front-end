<script setup>
import {useMainStore} from "@/store/mainStore.js";
import {storeToRefs} from "pinia";


const mainStore = useMainStore();


// ========================================================
// Color Mapping
const {colorMapping} = storeToRefs(mainStore);
const operators = [
    'Maxis',
    'Celcom',
    'Digi',
    'UMobile',
    'YTL',
    'TM',
];


// ========================================================
// Chart size
const {chartSizeClass, chartSizeClassOptions} = storeToRefs(mainStore);


</script>

<template>
    <div>
        <q-list bordered class="rounded-borders">
            <q-expansion-item
                    expand-separator
                    icon="signal_cellular_alt"
                    label="Operator Colors"
                    default-opened
            >
                <q-card>
                    <q-card-section>
                        <!--                      color pickers for color mapping obj-->
                        <q-input v-for="operator in operators"
                                 :key="operator"
                                 v-model="colorMapping[operator]"
                                 :label="operator"
                                 dense
                                 outlined
                                 :rules="['hexColor']"
                        >
                            <template v-slot:append>
                                <span
                                        :style="`width: 20px; height: 20px; background-color: ${colorMapping[operator]}; border-radius: 50%; display: inline-block;`"
                                >

                                </span>
                                <q-icon name="colorize" class="cursor-pointer">
                                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                                        <q-color v-model="colorMapping[operator]"/>
                                    </q-popup-proxy>
                                </q-icon>
                            </template>
                        </q-input>


                    </q-card-section>
                </q-card>
            </q-expansion-item>

            <q-expansion-item
                    expand-separator
                    icon="aspect_ratio"
                    label="Chart Size"
            >
                <q-card>
                    <q-card-section>
                        <div>Flex Chart</div>
                        <q-select

                                :options="chartSizeClassOptions"
                                v-model="chartSizeClass"
                                option-label="label"
                                option-value="value"
                                outlined
                       />
                    </q-card-section>
                </q-card>
            </q-expansion-item>


        </q-list>


    </div>
    <q-separator/>


</template>


<style scoped>

</style>