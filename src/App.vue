<template>
  <v-app>
    <AppBar @toggleDrawer="drawer = !drawer" />
    <AppDrawer v-model="drawer" />
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup>
import { ref } from "vue";
import AppDrawer from "@/components/AppDrawer.vue";
import { cleanExpiredData } from "@/composables/localStorageUtil";

const drawer = ref(false); // drawer 상태 추가
cleanExpiredData(); // 만료된 데이터 정리

</script>