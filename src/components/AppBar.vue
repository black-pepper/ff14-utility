<template>
  <v-app-bar app density="compact" :elevation="0" color="grey-lighten-4">
    <v-btn icon @click="$emit('toggleDrawer')">
      <v-icon>mdi-menu</v-icon>
    </v-btn>
    <v-toolbar-title @click="$router.push('/')">
      어느 모험가의 다이어리
    </v-toolbar-title>
  </v-app-bar>
</template>

<script setup>
import "@/styles/fonts.css";
</script>

<style scoped>
.v-toolbar-title {
  cursor: pointer;
  font-weight: bold;
}
</style>