<script setup lang="ts">
import config from '@/config/moogleConfig';
import { computed, ref, watch, onMounted, watchEffect, onBeforeMount, reactive } from 'vue';
import axios from 'axios';
//config.rewards의 개수만큼 0인 배열 생성
const counts = ref<number[]>(Array(config.rewards.length).fill(0));
const panels = ref([0]);
const rewards = reactive(config.rewards);

const calculateTomestones = computed(() =>
  counts.value.map((count, index) => count * config.rewards[index].tomestones)
);

const calculateTotalTomestones = computed(() => {
  return calculateTomestones.value.reduce((acc, cur) => acc + cur, 0)
});

// counts 배열 로컬스토리지에 저장
const saveToLocalStorage = () => {
  localStorage.setItem('moogleCounts', JSON.stringify(counts.value));
};

// 로컬스토리지에서 counts 배열 불러오기
const loadFromLocalStorage = () => {
  const savedCounts = localStorage.getItem('moogleCounts');
  if (savedCounts) {
    counts.value = JSON.parse(savedCounts);
  }
};

const rowStyles = computed(() =>
  counts.value.map(count => count != 0 ? 'bg-highlights' : '')
);

onMounted(() => {
  loadFromLocalStorage();
});

watch(counts, saveToLocalStorage, { deep: true });

const sorted = ref('');
const direction = ref('');
const rewardsWithIndex = computed(() =>
  rewards.map((reward, index) => ({ ...reward, originalIndex: index }))
);

const changeSort = (value: string) => {
  if (sorted.value === value) {
    if (direction.value === 'desc') {
      sorted.value = '';
      direction.value = '';
    } else {
      direction.value = 'desc';
    }
  } else {
    sorted.value = value;
    direction.value = 'asc';
  }
};

const sortedRewards = computed(() => {
  if (!sorted.value) {
    return rewardsWithIndex.value;
  }
  return rewardsWithIndex.value.slice().sort((a, b) => {
    if (a[sorted.value] > b[sorted.value]) {
      return direction.value === 'asc' ? 1 : -1;
    }
    if (a[sorted.value] < b[sorted.value]) {
      return direction.value === 'asc' ? -1 : 1;
    }
    return 0;
  });
});

//config에 price데이터 추가하기
const getPrice = async () => {
  const results = await getAllPricesResponse();
  const itemIdMap = new Map();
  results.forEach((item) => {
    itemIdMap.set(item.itemId, item);
  });

  rewards.forEach((reward) => {
    if (reward.itemId) {
      const item = itemIdMap.get(reward.itemId);
      reward.price = item.nq ? item.nq.minListing.region.price : 'error';
    } else {
      reward.price = null;
    }
  });
};

const getAllPricesResponse = async () => {
  const itemIdList = rewards.map(reward => reward.itemId).filter(itemId => itemId);
  const response = await axios.get(`https://universalis.app/api/v2/aggregated/한국/${itemIdList}`);
  return response.data.results;
};

const visibleRecentPrice = ref(false);
const isLoading = ref(false);
watch(visibleRecentPrice,() => { 
  isLoading.value = true;
  if(visibleRecentPrice.value) getPrice() 
  isLoading.value = false;
});
</script>

<template>
  <v-container>
    <v-container>
    <v-row justify="space-between" align="center">
      <v-col cols="auto">
        <h1>모그모그★컬렉션 {{ config.subTitle }}</h1>
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
        <h3>필요한 석판 수 : {{ calculateTotalTomestones }}</h3>
      </v-expansion-panel-title>
      <v-expansion-panel-text>
    <v-table variant="outlined" density="compact" height="500" fixed-header>
      <thead>
        <tr>
          <th class="text-center" @click="changeSort('category')" :style="{ cursor: 'pointer' }">분류<span v-if="sorted === 'category'">{{ direction === 'asc' ? '▴' : '▾' }}</span></th>
          <th class="text-center" @click="changeSort('name')" :style="{ cursor: 'pointer' }">아이템<span v-if="sorted === 'name'">{{ direction === 'asc' ? '▴' : '▾' }}</span></th>
          <th v-if="visibleRecentPrice" class="text-center" @click="changeSort('price')" :style="{ cursor: 'pointer' }">장터 최저가<span v-if="sorted === 'price'">{{ direction === 'asc' ? '▴' : '▾' }}</span></th>
          <th class="text-center" @click="changeSort('tomestones')" :style="{ cursor: 'pointer' }">석판 수<span v-if="sorted === 'tomestones'">{{ direction === 'asc' ? '▴' : '▾' }}</span></th>
          <th class="text-center">개수</th>
          <th class="text-center">석판 합계</th>
        </tr>
      </thead>
      <tbody>
      <tr v-for="(item) in sortedRewards" :key="item.originalIndex" :class="rowStyles[item.originalIndex]">
        <td class="text-center">{{ item.category }}</td>
        <td class="text-center" style="cursor:pointer">
          <v-tooltip v-if="item.description" :text="item.description">
            <template v-slot:activator="{ props }">
              <span v-bind="props">{{ item.name }}</span>
            </template>
          </v-tooltip>
          <span v-else>{{ item.name }}</span>
          <span v-if="item.itemId">*</span>
        </td>
        <td class="text-center" v-if="visibleRecentPrice">
          <a v-if="item.price" :href="'https://universalis.app/market/'+item.itemId" target="_blank">{{ item.price.toLocaleString('ko-KR') }}</a>
          <span v-else>-</span>
        </td>
        <td class="text-center">{{ item.tomestones }}</td>
        <td class="text-center" style="max-width: 150px; min-width: 80px;">
          <v-text-field 
            v-model="counts[item.originalIndex]" 
            variant="outlined"
            type="number"
            min="0"
            density="compact"
          />
        </td>
        <td class="text-center">{{ calculateTomestones[item.originalIndex] || 0 }}</td>
      </tr>
    </tbody>
    </v-table>
  
    <v-row justify="space-between" align="center">
      <v-col cols="auto">
        <div style="color:grey; margin-top: 10px; font-size: 0.8rem;">
          ※ 아이템명에 마우스를 올리면 입수 방법이 표시됩니다. <br>
          ※ 분류, 아이템, 석판 수, 장터 최저가를 클릭하면 정렬됩니다. <br>
          ※ *표시가 있는 아이템은 거래 가능한 아이템이며, 표시된 장터 최저가는 universalis에서 제공하는 데이터입니다.
        </div>
      </v-col>
      <v-col cols="auto">
        <v-switch 
        label="장터 최저가 표시" 
        v-model="visibleRecentPrice" 
        density="compact" 
        color="primary"
        :loading="isLoading ? 'warning' : false"
        ></v-switch>
      </v-col>
    </v-row>
  </v-expansion-panel-text>
  </v-expansion-panel>
  </v-expansion-panels>
  </v-container>
</template>

<style>
</style>