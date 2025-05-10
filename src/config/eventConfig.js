export default {
    eventName: "'또 하나의 미래' 이벤트",
    startDate: new Date('2025-04-15T12:00:00'),
    endDate: new Date('2025-05-12'),
    url: "https://www.ff14.co.kr/events/2025/FuturesRewritten",
    targetScore: 100,
    missionTitle: '일일 미션',
    missions: [
        {
            title: "레벨링",
            description: "'무작위 임무: 레벨링' 1회 완료",
        },
        {
            title: "일반레이드",
            description: "'무작위 임무: 일반 레이드'1회  완료",
        }
    ],
    missionScore: 2,
    minMissionCount: 0,
    maxMissionCount: null,
    uniqueMissionTitle: '한정 미션',
    uniqueMissions: [
        {
            title:"",
            score: 0,
        }, 
    ],
    weeklyMissionTitle: '주간 미션',
    weeklyMissions: [
        {
            title: "쿠로의 공상 수첩",
            score: 1,
        }
    ]
}
