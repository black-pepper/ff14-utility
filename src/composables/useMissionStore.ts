// composables/useMissionStore.ts
import { reactive, ref, computed, watch, onMounted } from 'vue';
import config from '@/config/eventConfig';
import { saveData, loadData } from './localStorageUtil';

export function useMissionStore() {
  const missionStatus = reactive(generateData(config.startDate, config.endDate))
  const weeklyMissionsStatus = reactive(generateWeekly(config.startDate, config.endDate));
  const uniqueMissionStatus = reactive(new Array(config.uniqueMissions.length).fill(false));
  const panels = ref([0, 1, 2]);

  const selectedPeriod = ref(config.endDate.toLocaleDateString('en-CA'));

  // 로컬 데이터 불러오기
  const loadFromLocalStorage = () => {
    const savedData = loadData("event");
    if (savedData && saveData.length > 0) {  // savedData.value로 접근
      // missionStatus = reactive(savedData.missionStatus);
      // uniqueMissionStatus = reactive(savedData.uniqueMissionStatus);
      // panels.value = savedData.panels;
      missionStatus.splice(0, missionStatus.length, ...savedData.missionStatus);
      weeklyMissionsStatus.splice(0, weeklyMissionsStatus.length, ...savedData.weeklyMissionsStatus);
      uniqueMissionStatus.splice(0, uniqueMissionStatus.length, ...savedData.uniqueMissionStatus);
      panels.value = savedData.panels; // panels는 ref이므로 .value를 사용해야 함
    } else {
      console.log('No saved data found.');
    }
  };
  
  const saveToLocalStorage = () => {
    const event = {
      missionStatus,
      weeklyMissionsStatus,
      uniqueMissionStatus,
      panels: panels.value
    };
    saveData("event", event, config.endDate);  // config.endDate가 Date면 저장 함수에서 getTime() 처리
  };

  watch([missionStatus, uniqueMissionStatus], saveToLocalStorage, { deep: true });
  onMounted(loadFromLocalStorage);

  return { missionStatus, weeklyMissionsStatus, uniqueMissionStatus, panels, selectedPeriod, saveToLocalStorage, loadFromLocalStorage };
}

function generateData(startDate, endDate) {
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

function generateWeekly(startDate, endDate) {
  const status = [];
  const diffWeeks = Math.ceil(Math.abs(endDate - startDate) / (1000 * 60 * 60 * 24 * 7));
  for (let i = 0; i < config.weeklyMissions.length; i++){
    status.push(Array(diffWeeks).fill(false));
  }
  return status;
}