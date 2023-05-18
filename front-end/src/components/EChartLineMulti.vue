<script setup>
import {connect, use} from "echarts/core";
import {CanvasRenderer, SVGRenderer} from "echarts/renderers";
import {LineChart} from "echarts/charts";
import {
    DataZoomComponent,
    GridComponent,
    LegendComponent,
    TitleComponent,
    ToolboxComponent,
    TooltipComponent,
} from "echarts/components";
import "echarts/theme/dark";
import VChart from "vue-echarts";
import {computed, defineComponent, onBeforeUnmount, ref, watch, watchEffect} from "vue";
import {storeToRefs} from "pinia";
import {useMainStore} from "@/store/mainStore.js";
import { utcToZonedTime, format } from 'date-fns-tz';


const timeZone = 'Asia/Singapore';

const props = defineProps({
    data: {
        type: Array,
        required: true,
    },
    colorMapping: {
        type: Object,
        default: () => {
        }
    },
    kpiColumn: {
        type: String,
        required: true,
    },

    addOption: {
        type: Object,
        default: () => {
        }
    },
    showZoom: {
        type: Boolean,
        default: true,
    },
    timeUnit: {
        type: String,
        default: 'daily',
    },
    theme: {
        type: String,
        default: 'dark',
    },
    region: {
        type: String,
        default: '',
    },
    cellName: {
        type: String,
        default: '',
    },

});

const getOption = function (kpiColumn, seriesArray, seriesName = '') {
    return {
        renderer: 'canvas',
        legend: {
            top: '11%',
            left: '10%',
            padding: [
                0,  // up
                0, // right
                0,  // down
                10, // left
            ],
            // selected: legendSelected.value || {},
            show: true,
        },
        dataZoom: [
            {
                type: 'slider',
                // ...dataZoomStartEnd,
                show: props.showZoom,
            }
        ],
        grid: {
            left: '11%',
            top: '20%',
            right: '11%',
            bottom: props.showZoom ? '25%' : '13%'
        },
        xAxis: {
            type: 'time',
            splitLine: {show: false},
            // axisLabel: {
            //     formatter: (value) => {
            //         const date = utcToZonedTime(value, timeZone);
            //         return format(date, 'dd MMM yyyy HH:mm', { timeZone });
            //     }
            // },
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross'
            },
            formatter: (params) => {
                //Math.round(kpiValue * 100) / 100
                return `${Math.round(params[0].value[1] * 100) / 100}`;
            },
        },
        // toolbox: getToolBox(chartRef, kpiColumn, getPopUpOption),
        title: {
            text: kpiColumn,
            textStyle: {
                fontSize: 15,
            },
            triggerEvent: true
        },
        yAxis: {
            splitLine: {show: false},
            type: 'value',
            scale: true,
            name: '',
            // nameLocation: 'middle',
            axisLabel: {
                inside: false,
                formatter: (value) => {
                    if (value >= 1000) {
                        // return `${(value / 1000).toFixed(1)}k`;
                        return value.toExponential(0);
                    }
                    return value;
                }
            },
        },

        series: seriesArray.map(series=>{
            if (!series.data || !series.data.map) return {};
            const seriesObj = {
                data: series.data.map(item => [utcToZonedTime(item[0], timeZone) ,item[1]]),
                type: 'line',
                name: series.name,
            };
            if (props.colorMapping[series.name]) {
                return {
                    ...seriesObj,
                    itemStyle: {
                        color: props.colorMapping[series.name],
                    },
                }
            }
            return seriesObj
        }),

        ...props.addOption,
    };
};

const chartOption = getOption(props.kpiColumn, props.data);

use([
    CanvasRenderer,
    SVGRenderer,
    TitleComponent,
    TooltipComponent,
    LegendComponent,
    DataZoomComponent,
    ToolboxComponent,
    GridComponent,
    LineChart,
]);

const chartRef = ref(null);

watch(chartRef, (newVal) => {
    if (!chartRef.value) return;
    connect(props.timeUnit);
}, {immediate: true});

// method to set data
const refresh = () => {
    if (!chartRef.value) return;
    chartRef.value.setOption(getOption(props.kpiColumn, props.data, props.seriesName));
};

watch(() => props.data, () => {
    refresh();
}, {
    deep: true,
});

const mainStore = useMainStore();
const {darkMode} = storeToRefs(mainStore);
const computedTheme = computed(() => {
    if (darkMode.value) {
        return 'dark';
    }
    return 'light';
});

</script>

<template>
    <v-chart
            ref="chartRef"
            :option="chartOption"
            :theme="computedTheme"
            :autoresize="true"
            style="height: 300px;"
            :group="timeUnit"

    />
</template>


<style>
.body--dark .echarts .data-table {
    background-color: #2d2d2d;
    color: #fff;
}

.body--dark .echarts span {
    background-color: #2d2d2d;
    color: #fff;
}
</style>