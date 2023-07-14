<script setup>
import {computed, onMounted, ref, watch} from "vue";
import {sidebarItems, sidebarItemsCategories} from "@/router/sidebarItems.js";
import {useQuasar} from "quasar";
import {useMainStore} from "@/store/mainStore.js";
import {storeToRefs} from "pinia";
import {useRoute} from "vue-router";
import Settings from "@/components/Settings.vue";

const drawer = ref(false);

const miniState = ref(false);
const drawerClick = function (e) {
  // if in "mini" state and user
  // click on drawer, we switch it to "normal" mode
  if (miniState.value) {
    miniState.value = false;

    // notice we have registered an event with capture flag;
    // we need to stop further propagation as this click is
    // intended for switching drawer to "normal" mode only
    e.stopPropagation();
  }
};

const $q = useQuasar();
const mainStore = useMainStore();
const {darkMode} = storeToRefs(mainStore);
watch(darkMode, (value) => {
  $q.dark.set(value);
}, {immediate: true});

// get current route and store as ref currentRoute
const route = useRoute();
const routeName = computed(() => route.name);

const footerVisible = ref(false);

// set footerVisible to true intermittently for 1 seconds after idle time of 1 seconds and then repeat
//  check if production using VITE Env

// const idleTime = import.meta.env.PROD ? 120_000 : 10_000;
const idleTime = 24 * 60 * 60 * 1000;
const intermittentTime = 3000;
const idleTimer = ref(null);
const intermittentTimer = ref(null);

const resetTimers = () => {
  clearTimeout(idleTimer.value);
  clearTimeout(intermittentTimer.value);
  idleTimer.value = setTimeout(() => {
    footerVisible.value = true;
    intermittentTimer.value = setTimeout(() => {
      footerVisible.value = false;
      resetTimers();
    }, intermittentTime);
  }, idleTime);
};

onMounted(() => {
  // footerVisible.value = true;
  // setTimeout(() => {
  //   footerVisible.value = false;
  //   resetTimers();
  // }, 10_000);
});

const rightDrawerOpen = ref(false);
const toggleRightDrawer = function () {
  rightDrawerOpen.value = !rightDrawerOpen.value;
};

</script>


<template>
  <div class="q-pa-md">
    <q-layout view="hHh Lpr fFf">
      <q-header elevated>
        <q-toolbar>
          <q-btn flat @click="drawer = !drawer" round dense icon="menu"/>
          <q-toolbar-title>HAWK KPI Dashboard</q-toolbar-title>
          <q-space/>
          <q-toggle
              v-model="darkMode" label="Dark Mode" dense
              color="warning"
          />
          <q-btn flat round dense icon="settings" @click="toggleRightDrawer"
                 class="q-ml-md"
          />
        </q-toolbar>
      </q-header>

      <q-drawer
          v-model="drawer"
          show-if-above
          :mini="!drawer || miniState"
          @click.capture="drawerClick"

          :width="200"
          :breakpoint="500"
          bordered

      >
        <q-scroll-area class="fit" :horizontal-thumb-style="{ opacity: 0 }">
          <q-list padding
          >
            <q-expansion-item
                expand-separator
                v-for="category in sidebarItemsCategories"
                :label="category.label"
                :key="category.label"
                default-opened
            >
              <q-card
                  bordered
                  v-for="item in sidebarItems"
                  :key="item.id"
                  class="q-pl-md"
              >
                <q-item
                    v-if="category.label === item.category"
                    clickable v-ripple :to=item.to
                >
                  <q-item-section avatar>
                    <q-icon :name="item.icon"/>
                  </q-item-section>
                  <q-item-section :class="{active: item.routeName===routeName}">
                    {{ item.label }}
                  </q-item-section>
                </q-item>
              </q-card>
            </q-expansion-item>

          </q-list>
        </q-scroll-area>

        <!--
          in this case, we use a button (can be anything)
          so that user can switch back
          to mini-mode
        -->
        <div class="q-mini-drawer-hide absolute" style="top: 15px; right: -17px">
          <q-btn
              dense
              round
              unelevated
              color="accent"
              icon="chevron_left"
              @click="miniState = true"
          />
        </div>
      </q-drawer>

      <q-drawer v-model="rightDrawerOpen" side="right" overlay bordered>
        <!--                <div>Coming Soon... Work in Progress</div>-->
        <settings/>
      </q-drawer>

      <q-page-container>
        <q-page class="q-px-lg q-py-md">
          <router-view/>
        </q-page>
      </q-page-container>
      <q-slide-transition>
        <q-footer elevated class="bg-primary text-white" v-if="footerVisible" style="border: white 2px solid">
          <q-toolbar>
            <q-toolbar-title>
              <span class="q-mx-md">DEMO VERSION: </span><span style="font-size: 15px;">&copy; 2023 vee.huen.phan@ericsson.com </span>
            </q-toolbar-title>
          </q-toolbar>
        </q-footer>
      </q-slide-transition>
    </q-layout>
  </div>
</template>
<style>

.q-mini-drawer-hide {
  transition: all .3s ease-in-out;
}

.q-drawer--standard {
  transition: all 1s ease-in-out;
}

.q-drawer--mini {
  transition: all 1s ease-in-out;
}

.active {
  /*    double underline the text*/
  text-decoration: underline;
  text-decoration-style: double;
  //text-decoration-color: #37ffd4;
  /*    make text bold */
  font-weight: bold;
  /*    make font bigger */
  font-size: 1.5em;
}

</style>