<script setup lang="ts">
import config from '@/config/moogleConfig';
import { ref } from 'vue';
const value = ref(0);
</script>

<template>
  <v-container>
    <v-container>
    <v-row justify="space-between" align="center">
      <v-col cols="auto">
        <h1>모그모그★컬렉션 {{ config.subTitle }}</h1>
        <p>{{ config.startDate.toLocaleDateString('en-CA') }} ~ {{  config.endDate.toLocaleDateString('en-CA') }}</p>
      </v-col>
      <v-col cols="auto">
        <v-btn variant="outlined" :href="config.url" target="_blank">이벤트 페이지 바로가기</v-btn>
      </v-col>
    </v-row>
  </v-container>
    <v-expansion-panels variant="accordion" multiple>
    <v-expansion-panel>
      <v-expansion-panel-title v-slot="{ expanded }">
        <h3>교환 가능 아이템 (개발중)</h3>
      </v-expansion-panel-title>
      <v-expansion-panel-text>
    <v-table variant="outlined" density="compact" height="500" fixed-header>
      <thead>
        <tr>
          <th class="text-center">아이템</th>
          <th class="text-center">필요 석판 수</th>
          <th class="text-center">개수</th>
          <th class="text-center">총 석판 수</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in config.rewards" :key="index">
          <td class="text-center" style="cursor:pointer">{{ item.name }}</td>
          <td class="text-center">{{ item.tomestones }}</td>
          <td class="text-center"><v-number-input v-model="value" label="숫자 입력" variant="outlined"/></td>
          <td class="text-center"></td>
        </tr>
      </tbody>
    </v-table>
  </v-expansion-panel-text>
  </v-expansion-panel>
  </v-expansion-panels>
  </v-container>
</template>

<style>
</style>