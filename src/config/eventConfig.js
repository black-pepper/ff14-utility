export default {
    eventName: "미지의 모험을 공략하자!",
    startDate: new Date('2025-03-18T12:00:00'),
    endDate: new Date('2025-04-14'),
    url: "https://www.ff14.co.kr/events/2025/v7_1_promotion_all",
    targetScore: 100,
    missionTitle: '일일 미션',
    missions: [
        {
            title: "레벨링",
            description: "'무작위 임무: 레벨링' 완료",
        },
        {
            title: "무숙",
            description: "'무작위 임무: 숙련자' 완료",
        },
        {
            title: "전장",
            description: "'일일 도전: 전장' 완료",
        },
        {
            title: "크컨",
            description: "'크리스탈라인 컨플릭트' 3회 완료",
        }
    ],
    minMissionCount: 2,
    uniqueMissionTitle: '한정 미션',
    uniqueMissions: [
        {
            title:"우호부족 '펠루펠루족' 개방",
            score: 10,
        }, 
        {
            title:"'미지와의 해후' 업적 달성",
            score: 10,
        },
        {
            title:"'아르카디아 선수권: 라이트헤비급 4' 완료",
            score: 10,
        }
    ],
    weeklyMissionTitle: '주간 미션',
    weeklyMissions: [
        {
            title: "신규 연합 레이드 '쥬노: 첫 번째 반향세계' 완료",
            score: 10,
        }
    ]
}
