import { computed } from 'vue';

export function useScoreCalculations(config, missionStatus, weeklyMissionsStatus, uniqueMissionStatus, selectedPeriod, countPoint) {
  const uniqueMissionsScore = computed(() =>
    uniqueMissionStatus.reduce((total, checked, index) => {
      return total + (checked ? config.uniqueMissions[index].score : 0);
    }, 0)
  );

  const weeklyMissionsScore = computed(() => {
      let totalChecked = 0;
      let result = 0;
      // 각 주차별로 체크된 값(true)의 개수를 세는 이중 반복문
      for (let i = 0; i < weeklyMissionsStatus.length; i++) {
        for (let j = 0; j < weeklyMissionsStatus[i].length; j++) {
          if (weeklyMissionsStatus[i][j] === true) {
            totalChecked++;
          }
        }
        result += totalChecked * config.weeklyMissions[i].score;
      }
      return result;
    }
  );

  const yesterdayIndex = computed(() => {
    const startDate = new Date(config.startDate);
    startDate.setHours(0, 0, 0, 0);
    const diff = Date.now() - startDate.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  });

  const totalScoreYesterday = computed(() =>
    missionStatus.slice(0, yesterdayIndex.value).reduce((total, item) => {
      let score = dailyScore(item) // check 배열에서 true 개수 세기
      return total + score;
    }, 0) + uniqueMissionsScore.value + weeklyMissionsScore.value
  );

  const dailyScore = (item) => {
    if(config.maxMissionCount != null) {
      return Math.min(item.checks.filter(Boolean).length, config.maxMissionCount);
    }
    return item.checks.filter(Boolean).length;
  };

  const selectedDateIndex = computed(() => {
    const selectedDate = new Date(selectedPeriod.value);
    selectedDate.setHours(0, 0, 0, 0);
    const diff = selectedDate.getTime() - Date.now();
    return Math.max(Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1, 0);
  });

  const expectedScore = computed(() => {
    return totalScoreYesterday.value + (selectedDateIndex.value * countPoint.value);
  });

  const totalScore = computed(() =>
    missionStatus.reduce((total, item) => total + dailyScore(item), 0) +
    uniqueMissionsScore.value + weeklyMissionsScore.value
  );

  return {
    uniqueMissionsScore,
    totalScoreYesterday,
    yesterdayIndex,
    selectedDateIndex,
    expectedScore,
    totalScore,
    dailyScore
  };
}