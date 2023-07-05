import {createFetch} from "@vueuse/core";
import {colorTrace} from "@/utils/myFunctions.js";
import {triggerNegative} from "@/utils/notifications.js";

console.log(import.meta.env.PROD);
export function getBaseUrl() {
    if (import.meta.env.PROD) {
        return import.meta.env.VITE_API_BASE_URL_PROD_NODE;
    }
    return import.meta.env.VITE_API_BASE_URL_DEV_FLASK;
}

class MyFetch {
    constructor(baseUrl) {

        this.baseUrl = baseUrl;
        this.useFetchOptions = {
            immediate: false,

            onFetchError(ctx) {
                // ctx.data can be null when 5xx response
                console.log(ctx.error);
                if (ctx.error.message.indexOf("Failed to execute 'fetch' on 'Window'")>=0){
                    return;
                }

                triggerNegative({
                    message: ctx.error.stack || ctx.error.message || 'Fetching data failed.',
                });
                return ctx;
            },

            async beforeFetch({url, options, cancel}) {
                // options.headers = {
                //     ...options.headers,
                //     'Accept': 'application/json',
                // };
            }

        };

        this.myUseFetch = createFetch({

            baseUrl,
            options: this.useFetchOptions,
            // fetchOptions: {
            //     mode: 'cors',
            // },

        });


    }

    errorHandling(error, statusCode) {

        colorTrace(error, 'red');

        triggerNegative({
            message: error.message,
            position: 'center',
        });

        const errorMessage = data.data?.message || error.statusText;

        debugger;
        triggerNegative({
            message: errorMessage,
        });

        if (statusCode !== 200) {
            triggerNegative({
                message: `Something went wrong. Status code ${statusCode}`,
            });
        }

    }

    // static method to generate url with query params
    static generateUrl(url, params = {}) {
        const query = new URLSearchParams(params).toString();
        return url + '?' + query;
    }


    get(url) {

        // const query = new URLSearchParams(params).toString();
        // let fetcher = this.myUseFetch(url + '?' + query);

        let fetcher = this.myUseFetch(url);

        const {
            statusCode,
            // abort,
            // canAbort,
            isFetching,
            error,
            data,
        } = fetcher.get().json();

        if (error.value) {
            this.errorHandling(error.value, statusCode.value);
        }

        return {isFetching, error, data, execute: fetcher.execute};

    }

}

const BASE_URL_NODE = getBaseUrl();

export const api = () => new MyFetch(BASE_URL_NODE);

