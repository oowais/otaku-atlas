<template>
  <AnimeSearch />
  <AnimeResults class="mt-8" @open-drawer="handleOpenDrawer" />
  <AnimeDetails :animeId :key="drawerKey" />
</template>

<script setup lang="ts">
import { ref } from "vue";

const animeId = ref<number | null>(null);
const drawerKey = ref(0);

async function handleOpenDrawer(id: number) {
  animeId.value = id;
  drawerKey.value++;
}
</script>
