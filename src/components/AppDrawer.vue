<template>
  <v-navigation-drawer 
    :model-value="modelValue" 
    @update:model-value="$emit('update:modelValue', $event)" 
    app 
    permanent>
    <v-list>
      <v-list-item v-for="(item, index) in menuItems" :key="index" :to="item.to">
        <v-list-item-title>{{ item.text }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";
import config from "@/config/eventConfig";

defineProps({
  modelValue: Boolean, // v-model을 위한 props
});

const menuItems = [
  { text: config.eventName, to: "/event" },
  { text: "모그모그★컬렉션", to: "/moogle" },
];

defineEmits(["update:modelValue"]); // v-model 업데이트 이벤트
</script>