<script setup>
import {useMainStore} from "@/store/mainStore.js";
import {storeToRefs} from "pinia";

const mainStore = useMainStore();
const {colorMapping} = storeToRefs(mainStore);
const operators = [
    'Maxis',
    'Celcom',
    'Digi',
    'UMobile',
    'YTL',
    'TM',
];


</script>

<template>
    <div>
        <q-list bordered class="rounded-borders">
            <q-expansion-item
                    expand-separator
                    icon="signal_cellular_alt"
                    label="Operator Colors"
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

<!--            <q-expansion-item-->
<!--                    expand-separator-->
<!--                    icon="signal_wifi_off"-->
<!--                    label="Wifi settings"-->
<!--            >-->
<!--                <q-card>-->
<!--                    <q-card-section>-->
<!--                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quidem, eius reprehenderit eos-->
<!--                        corrupti-->
<!--                        commodi magni quaerat ex numquam, dolorum officiis modi facere maiores architecto suscipit iste-->
<!--                        eveniet doloribus ullam aliquid.-->
<!--                    </q-card-section>-->
<!--                </q-card>-->
<!--            </q-expansion-item>-->


        </q-list>


    </div>
    <q-separator/>


</template>


<style scoped>

</style>