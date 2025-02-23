<script setup lang="ts">
import { ref, computed, reactive, onMounted, watch } from 'vue'
import config from '@/config';
import { useMissionStore } from '@/composables/useMissionStore';
import { calculateScore, getRowStyle } from '@/utils/useMissionUtils';
import { useScoreCalculations } from '@/composables/useScoreCalculations';

const { missionStatus, uniqueMissionStatus, panels, selectedPeriod, countPoint, saveToLocalStorage, loadFromLocalStorage } = useMissionStore();

const today = new Date();
function generatePeriodList(startDate, endDate) {
  const dates = [];
  let currentDate = new Date(startDate);
  currentDate.setHours(0, 0, 0, 0);
  endDate.setHours(0, 0, 0, 0);  // endDate에도 시간 초기화
  while (currentDate <= endDate) {
    const formattedDate = currentDate.toLocaleDateString('en-CA'); // YYYY-MM-DD 형식 변환
    dates.push(formattedDate);
    currentDate.setDate(currentDate.getDate() + 1); // 하루 증가
  }
  return dates;
}
const periodList = generatePeriodList(today, config.endDate); 
const countPointList = Array.from({ length: config.missions.length }, (_, i) => i + 1);

const {
      totalScoreYesterday,
      expectedScore,
      totalScore
    } = useScoreCalculations(config, missionStatus, uniqueMissionStatus, selectedPeriod, countPoint);

// 해당 날짜의 체크박스가 모두 선택된 상태인지 확인
const isAllChecked = (index) => {
  return missionStatus[index].checks.every((check) => check);
};

// 전체 체크/해제
const toggleAllChecks = (index) => {
  const allChecked = isAllChecked(index);
  missionStatus[index].checks = missionStatus[index].checks.map(() => !allChecked);
};

onMounted(() => {
  loadFromLocalStorage(); // 컴포넌트가 마운트될 때 로컬 스토리지에서 데이터를 불러옴
});

// 로컬 데이터 저장하기
watch([missionStatus, uniqueMissionStatus, panels], saveToLocalStorage, { deep: true });
</script>

<template>
  <v-container>
    <v-container>
    <v-row justify="space-between" align="center">
      <v-col cols="auto">
      <h1>{{ config.eventName }}</h1>
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
        <h3>{{ config.uniqueMissionTitle }}</h3>
      </v-expansion-panel-title>
      <v-expansion-panel-text>
        <v-checkbox v-for="(mission, index) in config.uniqueMissions" 
      :key="index" v-model="uniqueMissionStatus[index]" :label="mission.title" density="compact"/>
      </v-expansion-panel-text>
    <!-- <v-card variant="outlined" style="border-color: lightgray; overflow-y: auto;" max-height="500"> -->
    </v-expansion-panel>
    <v-expansion-panel>
      <v-expansion-panel-title v-slot="{ expanded }">
        <h3>{{ config.missionTitle }}</h3>
      </v-expansion-panel-title>
      <v-expansion-panel-text>
    <v-table variant="outlined" density="compact" height="500" fixed-header>
      <thead>
        <tr>
          <th rowspan="2" class="text-center">날짜</th>
          <th class="text-center" :colspan="missionStatus[0]?.checks.length">목록</th>
          <th rowspan="2" class="text-center">합계<br>{{ totalScore }}/{{ config.targetScore }}</th>
        </tr>
        <tr>
          <th v-for="mission in config.missions" class="text-center">
            <v-tooltip :text="mission.description">
              <template v-slot:activator="{ props }">
                <span v-bind="props">{{ mission.title }}</span>
              </template>
            </v-tooltip>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in missionStatus" :key="item.date" :class="getRowStyle(item)">
          <td class="text-center" @click="toggleAllChecks(index)" style="cursor:pointer">{{ item.date }}</td>
          <td class="text-center" v-for="(c, index) in item.checks" :key="index">
            <div class="checkbox-wrapper"><v-checkbox v-model="item.checks[index]" density="compact"/></div>
          </td>
          <td class="text-center">{{ calculateScore(item) }}</td>
        </tr>
      </tbody>
    </v-table>
  </v-expansion-panel-text>
  </v-expansion-panel>
  <v-expansion-panel readonly expand-icon="">
    <v-expansion-panel-title>
  <!-- </v-card> -->
  <div>&nbsp;</div>
  <v-row align="center" justify="start">
    <v-col cols="auto">
      <span>오늘부터</span>
    </v-col>
    <v-col cols="auto">
      <v-select  density="compact"
        variant="underlined"
        v-model="selectedPeriod"
        :items="periodList"
        style="max-width: 120px;"
      ></v-select>
    </v-col>
    <v-col cols="auto">
      <span>까지</span>
    </v-col>
    <v-col cols="auto">
      <v-select  
        density="compact"
        variant="underlined"
        v-model="countPoint"
        :items="countPointList"
        style="max-width: 80px;"
      ></v-select>
    </v-col>
    <v-col cols="auto">
      <span>개씩 완료 시 예상 수: {{expectedScore}} &nbsp; (어제 까지의 합계: {{ totalScoreYesterday }})</span>
    </v-col>
    <v-col cols="auto">
      <span></span>
    </v-col>
  </v-row>
    </v-expansion-panel-title>
  <v-expansion-panel-text>
    ??
  </v-expansion-panel-text>
  </v-expansion-panel>
  </v-expansion-panels>
  </v-container>
</template>
<style scoped>
.checkbox-wrapper {
  display: flex;
  justify-content: center; /* 가로 가운데 정렬 */
  align-items: center; /* 세로 가운데 정렬 */
}
</style>
<style>
.v-input__details {
  display: none !important;/* 메시지 영역 숨기기 */
}
tfoot {
  background-color: #f0f0f0; /* 원하는 배경색 */
  font-weight: bold; /* 원하는 폰트 스타일 */
}

tfoot td {
  padding: 10px; /* 테이블 셀 안쪽 여백 */
}
</style>