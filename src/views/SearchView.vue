<template>
  <AnimeSearch />
  <AnimeResults class="mt-8" @open-drawer="(id) => (openDrawer = id)" />
  <AnimeDetails :open="openDrawer" />
</template>

<script setup lang="ts">
import { ref } from "vue";

const openDrawer = ref<number | null>(null);
</script>
