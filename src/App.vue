<template>
  <v-app>
    <v-app-bar app density="compact" :elevation="0" color="grey-lighten-4">
      <v-btn icon @click="drawer = !drawer">
        <v-icon>mdi-menu</v-icon>
      </v-btn>
      <v-toolbar-title @click="$router.push('/')" :style="{ cursor: 'pointer' }">FF14 이벤트 체크리스트</v-toolbar-title>
    </v-app-bar>
    <AppDrawer v-model="drawer" />
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup>
import { ref } from "vue";
import AppDrawer from "@/components/AppDrawer.vue";
const drawer = ref(false); // drawer 상태 추가
</script>