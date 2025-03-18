<script setup lang="ts">
import eventData from '@/config/eventList';
import { computed } from 'vue';

const eventList = eventData.eventList;
const formatDate = (date) => {
  return new Date(date).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const goEvent = (url) =>  window.open(url, "_blank");

const today = new Date();
today.setHours(0, 0, 0, 0);
const ongoingEvents = computed(() => {
  return eventList.filter((event) => event.endDate >= today);
});
const rewardEvents = computed(() => {
  return eventList.filter((event) => event.endDate < today && event.ReceivingDate != null && event.ReceivingDate >= today);
});
</script>

<template>
  <v-container>
    <v-col>
      <v-card class="mx-auto">
        <v-card-item>
          <v-card-title>
            <b>진행중인 이벤트</b>
          </v-card-title>
        </v-card-item>
        <v-card-text>
          <v-list>
              <v-list-item v-for="(event, index) in ongoingEvents" :key="index" @click="goEvent(event.url)">
                <v-list-item-title>{{ event.title }}</v-list-item-title>
                <v-list-item-subtitle>
                  {{ formatDate(event.startDate) }} ~ {{ formatDate(event.endDate) }}
                </v-list-item-subtitle>
              </v-list-item>
          </v-list>
        </v-card-text>
    </v-card>
    </v-col>
    <v-col v-if="rewardEvents.length">
      <v-card class="mx-auto" >
        <v-card-item >
          <v-card-title>
            <b>종료된 이벤트</b>
          </v-card-title>
        </v-card-item>
        <v-card-text>
          <v-list>
              <v-list-item v-for="(event, index) in rewardEvents" :key="index" @click="goEvent(event.url)">
                <v-list-item-title>{{ event.title }}</v-list-item-title>
                <v-list-item-subtitle>
                  {{ formatDate(event.startDate) }} ~ {{ formatDate(event.endDate) }} / 보상 수령 기간: {{ formatDate(event.ReceivingDate) }}
                </v-list-item-subtitle>
              </v-list-item>
          </v-list>
        </v-card-text>
    
    </v-card>
    
    </v-col>
  <v-col>
    <v-card
        class="mx-auto"
    >
        <v-card-item>
        <v-card-subtitle>
            2025.03.03
        </v-card-subtitle>
        </v-card-item>
        <v-card-text>
            기존 페이지에 새로운 기능이나 새 페이지가 천천히 업데이트 될 예정입니다. <br>
            혹시 문제가 발생하거나 필요한 것이 있다면 <a href="https://x.com/BP_ff14_" target="_blank">@BP_ff14_</a> 로 알려주세요:D
        </v-card-text>
    
    </v-card>
  </v-col>
  </v-container>
  
</template>

<style scoped>
</style>