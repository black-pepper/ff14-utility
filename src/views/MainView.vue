<script setup lang="ts">
import eventData from '@/config/eventList';

const eventList = eventData.eventList;
const formatDate = (date) => {
  return new Date(date).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const goEvent = (url) =>  window.open(url, "_blank");
</script>

<template>
  <v-container>
    <v-col>
      <v-card
        class="mx-auto"
    >
        <v-card-item>
          <v-card-title>
            <b>진행중인 이벤트</b>
          </v-card-title>
        </v-card-item>
        <v-card-text>
          <v-list>
            <v-list-item-group>
              <v-list-item v-for="(event, index) in eventList" :key="index" @click="goEvent(event.url)">
                <v-list-item-title>{{ event.title }}</v-list-item-title>
                <v-list-item-subtitle>
                  {{ formatDate(event.startDate) }} ~ {{ formatDate(event.endDate) }}
                </v-list-item-subtitle>
              </v-list-item>
            </v-list-item-group>
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
            혹시 문제가 발생하거나 필요한 것이 있다면 <a href="https://x.com/BP_ff14_">@BP_ff14_</a> 로 알려주세요:D
        </v-card-text>
    
    </v-card>
  </v-col>
  </v-container>
  
</template>

<style scoped>
</style>