import {computed} from "vue";
import {triggerNegative} from "@/utils/notifications.js";


export const useApiArray = (apiArray, executeCallback = null) => {

    const isFetchingArray = apiArray.map((api) => api.isFetching);
    const errorArray = apiArray.map((api) => api.error);
    const dataArray = apiArray.map((api) => api.data);
    const isLoading = computed(() => {
        return isFetchingArray.some((isFetching) => isFetching.value);
    });
    const execute = async () => {
        const executePromisesArray = apiArray.map((api) => {

            try {
                api.execute();
            } catch (e) {
                console.log(e);
                return Promise.resolve();
            }

        });
        await Promise.all(executePromisesArray);
        errorArray.forEach((error) => {
            console.log(error);
            if (error.value === null) return;
            if (error.value.message.indexOf("Failed to execute 'fetch' on 'Window'") >= 0){
                return;
            }
            triggerNegative({message: error.value.message || 'Something went wrong.'});
        });
        executeCallback && executeCallback();
    };

    return {
        isFetchingArray,
        errorArray,
        dataArray,
        isLoading,
        execute,
    };

};