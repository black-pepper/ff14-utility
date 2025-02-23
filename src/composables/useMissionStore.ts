// composables/useMissionStore.ts
import { reactive, ref, computed, watch, onMounted } from 'vue';
import config from '@/config';

export function useMissionStore() {
  const missionStatus = reactive(generateData(config.startDate, config.endDate))
  const uniqueMissionStatus = reactive(new Array(config.uniqueMissions.length).fill(false));
  const panels = ref([0, 1]);

  const selectedPeriod = ref(config.endDate.toLocaleDateString('en-CA'));
  const countPoint = ref(6);

  // 로컬 데이터 불러오기
const loadFromLocalStorage = () => {
    const savedMissionStatus = localStorage.getItem('missionStatus');
    const savedUniqueMissionStatus = localStorage.getItem('uniqueMissionStatus');
    const savedLastSaveTime = localStorage.getItem('lastSaveTime');
    const savedPanels = localStorage.getItem('panels');
    if (savedMissionStatus) {
      // 저장된 데이터가 이벤트 시작일보다 이전인 경우, 저장된 데이터를 삭제
      if (savedLastSaveTime && new Date(savedLastSaveTime) < new Date(config.startDate)) {
        localStorage.removeItem('missionStatus');
        localStorage.removeItem('uniqueMissionStatus');
        localStorage.removeItem('panels')
        return;
      } else {
        // 저장된 데이터가 있으면 불러옴
        missionStatus.splice(0, missionStatus.length, ...JSON.parse(savedMissionStatus));
        uniqueMissionStatus.splice(0, uniqueMissionStatus.length, ...JSON.parse(savedUniqueMissionStatus));
        panels.value = JSON.parse(savedPanels);
      }
    }
  };

  const saveToLocalStorage = () => {
    localStorage.setItem('missionStatus', JSON.stringify(missionStatus));
    localStorage.setItem('uniqueMissionStatus', JSON.stringify(uniqueMissionStatus));
    localStorage.setItem('panels', JSON.stringify(panels.value));
  };

  watch([missionStatus, uniqueMissionStatus], saveToLocalStorage, { deep: true });
  onMounted(loadFromLocalStorage);

  return { missionStatus, uniqueMissionStatus, panels, selectedPeriod, countPoint, saveToLocalStorage, loadFromLocalStorage };
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