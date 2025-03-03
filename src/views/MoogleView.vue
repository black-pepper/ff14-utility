<script setup lang="ts">
import config from '@/config/moogleConfig';
import { computed, ref, watch, onMounted, watchEffect } from 'vue';
//config.rewards의 개수만큼 0인 배열 생성
const counts = ref<number[]>(Array(config.rewards.length).fill(0));
const panels = ref([0]);

const calculateTomestones = computed(() =>
  counts.value.map((count, index) => count * config.rewards[index].tomestones)
);

const calculateTotalTomestones = computed(() => {
  return calculateTomestones.value.reduce((acc, cur) => acc + cur, 0)
});

// counts 배열 로컬스토리지에 저장
const saveToLocalStorage = () => {
  localStorage.setItem('moogleCounts', JSON.stringify(counts.value));
};

// 로컬스토리지에서 counts 배열 불러오기
const loadFromLocalStorage = () => {
  const savedCounts = localStorage.getItem('moogleCounts');
  if (savedCounts) {
    counts.value = JSON.parse(savedCounts);
  }
};

const rowStyles = computed(() =>
  counts.value.map(count => count != 0 ? 'bg-primary' : '')
);

onMounted(() => {
  loadFromLocalStorage();
});

watch(counts, saveToLocalStorage, { deep: true });
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
    <v-expansion-panels variant="accordion" v-model="panels" multiple>
    <v-expansion-panel>
      <v-expansion-panel-title v-slot="{ expanded }">
        <h3>필요한 석판 수 : {{ calculateTotalTomestones }}</h3>
      </v-expansion-panel-title>
      <v-expansion-panel-text>
    <v-table variant="outlined" density="compact" height="500" fixed-header>
      <thead>
        <tr>
          <th class="text-center">분류</th>
          <th class="text-center">아이템</th>
          <th class="text-center">석판 수</th>
          <th class="text-center">개수</th>
          <th class="text-center">석판 합계</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in config.rewards" :key="index" :class="rowStyles[index]">
          <td class="text-center">{{ item.category }}</td>
          <td class="text-center" style="cursor:pointer">
            <v-tooltip v-if="item.description" :text="item.description">
              <template v-slot:activator="{ props }">
                <span v-bind="props">{{ item.name }}</span>
              </template>
            </v-tooltip>
            <span v-else>{{ item.name }}</span>
          </td>
          <td class="text-center">{{ item.tomestones }}</td>
          <td class="text-center"  style="max-width: 150px; min-width: 80px;">
            <v-text-field 
            v-model="counts[index]" 
            variant="outlined"
            type="number"
            min="0"
            density="compact"
            /></td>
          <td class="text-center">{{ calculateTomestones[index] || 0}}</td>
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