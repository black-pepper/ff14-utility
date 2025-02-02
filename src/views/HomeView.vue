<script setup lang="ts">
import { ref, computed, reactive, onMounted, watch } from 'vue'
import config from '@/config';

// 데이터 테이블 생성
function generateDates(startDate, endDate) {
  const dates = [];
  let currentDate = new Date(startDate);
  currentDate.setHours(0, 0, 0, 0);
  while (currentDate <= endDate) {
    const formattedDate = currentDate.toLocaleDateString('en-CA').split('T')[0]; // YYYY-MM-DD 형식 변환
    dates.push({ date: formattedDate, checks: Array(config.missions.length).fill(false) });
    currentDate.setDate(currentDate.getDate() + 1); // 하루 증가
  }
  return dates;
}
const missionStatus = reactive(generateDates(config.startDate, config.endDate))
const uniqueMissionStatus = reactive(new Array(config.uniqueMissions.length).fill(false));

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
const selectedPeriod = ref(config.endDate.toLocaleDateString('en-CA').split('T')[0]);
const periodList = generatePeriodList(today, config.endDate); 
const countPoint = ref(6);
const countPointList = Array.from({ length: config.missions.length }, (_, i) => i + 1);

const calculateScore = (item: any) => {
  return item.checks.reduce((sum, checked) => sum + checked, 0)
}

const totalScore = computed(() =>
  missionStatus.reduce((total, item) => {
    let score = item.checks.filter(Boolean).length // check 배열에서 true 개수 세기
    return total + score
  }, 0) 
  + (uniqueMissionStatus[0] ? config.uniqueMissions[0].score : 0) 
  + (uniqueMissionStatus[1] ? config.uniqueMissions[1].score : 0)
);


//이벤트 시작일로부터 며칠이 지났는지 계산
const yesterdayIndex = computed(() => {
  const startDate = new Date(config.startDate);
  startDate.setHours(0, 0, 0, 0);
  const diff = today.getTime() - new Date(startDate).getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
});
//어제까지의 점수 합계
const totalScoreYesterday = computed(() =>
  missionStatus.slice(0, yesterdayIndex.value).reduce((total, item) => {
    let score = item.checks.filter(Boolean).length // check 배열에서 true 개수 세기
    return total + score
  }, 0) 
  + (uniqueMissionStatus[0] ? config.uniqueMissions[0].score : 0) 
  + (uniqueMissionStatus[1] ? config.uniqueMissions[1].score : 0)
);

//오늘 날짜 표시
const getRowStyle = (item) => {
  today.setHours(0, 0, 0, 0); // 오늘 날짜의 시간부분을 00:00:00으로 설정

  const itemDate = new Date(item.date);
  itemDate.setHours(0, 0, 0, 0); // item 날짜의 시간부분을 00:00:00으로 설정

  if (itemDate.getTime() === today.getTime()) {
    return 'bg-primary'; // 오늘 날짜라면 배경색 설정
  }

  return '';
};

//선택일자까지 며칠 남았는지 계산
const selectedDateIndex = computed(() => {
  const selectedDate = new Date(selectedPeriod.value);
  selectedDate.setHours(0, 0, 0, 0);
  const diff = selectedDate.getTime() - today.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24))+1;
});
const expectedScore = computed(() => {
  return totalScoreYesterday.value + (selectedDateIndex.value * countPoint.value)
})

// 해당 날짜의 체크박스가 모두 선택된 상태인지 확인
const isAllChecked = (index) => {
  return missionStatus[index].checks.every((check) => check);
};

// 전체 체크/해제
const toggleAllChecks = (index) => {
  const allChecked = isAllChecked(index);
  missionStatus[index].checks = missionStatus[index].checks.map(() => !allChecked);
};

// 로컬 데이터 불러오기
const loadFromLocalStorage = () => {
  const savedMissionStatus = localStorage.getItem('missionStatus');
  const savedUniqueMissionStatus = localStorage.getItem('uniqueMissionStatus');
  const savedLastSaveTime = localStorage.getItem('lastSaveTime');
  if (savedMissionStatus) {
    // 저장된 데이터가 이벤트 시작일보다 이전인 경우, 저장된 데이터를 삭제
    if (savedLastSaveTime && new Date(savedLastSaveTime) < new Date(config.startDate)) {
      localStorage.removeItem('missionStatus');
      localStorage.removeItem('uniqueMissionStatus');
      return;
    } else {
      // 저장된 데이터가 있으면 불러옴
      missionStatus.splice(0, missionStatus.length, ...JSON.parse(savedMissionStatus));
      uniqueMissionStatus.splice(0, uniqueMissionStatus.length, ...JSON.parse(savedUniqueMissionStatus));
    }
  }
};

onMounted(() => {
  loadFromLocalStorage(); // 컴포넌트가 마운트될 때 로컬 스토리지에서 데이터를 불러옴
});

// 로컬 데이터 저장하기
const saveToLocalStorage = () => {
  localStorage.setItem('missionStatus', JSON.stringify(missionStatus));
  localStorage.setItem('uniqueMissionStatus', JSON.stringify(uniqueMissionStatus));
  localStorage.setItem('lastSaveTime', JSON.stringify(Date.now()));
};

watch([missionStatus, uniqueMissionStatus], saveToLocalStorage, { deep: true });
</script>

<template>
  <v-container>
    <h2>{{ config.eventName }}</h2>
    <div>&nbsp;</div>
    <v-checkbox v-for="(mission, index) in config.uniqueMissions" 
    :key="index" v-model="uniqueMissionStatus[index]" :label="mission.title" density="compact"/>
    <!-- <v-card variant="outlined" style="border-color: lightgray; overflow-y: auto;" max-height="500"> -->
    <v-table variant="outlined" density="compact" height="500" fixed-header>
      <thead>
        <tr>
          <th rowspan="2" class="text-center">날짜</th>
          <th class="text-center" :colspan="missionStatus[0]?.checks.length">목록</th>
          <th rowspan="2" class="text-center">합계<br>{{ totalScore }}/100</th>
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
  <div>&nbsp;</div>
  <v-col cols="auto">
    <v-btn variant="outlined" :href="config.url" target="_blank">이벤트 페이지 바로가기</v-btn>
  </v-col>
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