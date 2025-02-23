import { computed } from 'vue';

export function useScoreCalculations(config, missionStatus, uniqueMissionStatus, selectedPeriod, countPoint) {
  const uniqueMissionsScore = computed(() =>
    uniqueMissionStatus.reduce((total, checked, index) => {
      return total + (checked ? config.uniqueMissions[index].score : 0);
    }, 0)
  );

  const yesterdayIndex = computed(() => {
    const startDate = new Date(config.startDate);
    startDate.setHours(0, 0, 0, 0);
    const diff = Date.now() - startDate.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  });

  const totalScoreYesterday = computed(() =>
    missionStatus.slice(0, yesterdayIndex.value).reduce((total, item) => {
      let score = item.checks.filter(Boolean).length; // check 배열에서 true 개수 세기
      return total + score;
    }, 0) + uniqueMissionsScore.value
  );

  const selectedDateIndex = computed(() => {
    const selectedDate = new Date(selectedPeriod.value);
    selectedDate.setHours(0, 0, 0, 0);
    const diff = selectedDate.getTime() - Date.now();
    return Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1;
  });

  const expectedScore = computed(() => {
    return totalScoreYesterday.value + (selectedDateIndex.value * countPoint.value);
  });

  return {
    uniqueMissionsScore,
    totalScoreYesterday,
    yesterdayIndex,
    selectedDateIndex,
    expectedScore
  };
}