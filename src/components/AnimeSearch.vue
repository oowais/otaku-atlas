<template>
  <div class="relative items-center flex items-center gap-1.5">
    <Input
      ref="searchInput"
      v-model="searchTerm"
      id="search"
      type="text"
      placeholder="Search..."
      class="pl-10 h-14 text-xl"
      @keyup.enter="handleDirectSearch"
    />
    <span
      class="absolute start-0 inset-y-0 flex items-center justify-center px-2"
    >
      <Search class="size-6 text-muted-foreground" />
    </span>
    <Button
      v-if="searchTerm"
      class="py-7"
      variant="outline"
      @click="clearSearch"
    >
      <X class="size-6" />
    </Button>
  </div>
</template>

<script setup lang="ts">
import { useDebounceFn, useFocus } from "@vueuse/core";
import { Search, X } from "lucide-vue-next";
import { ref, useTemplateRef, watch } from "vue";

import { useSearchStore } from "@/stores/search";

const searchTerm = ref("");

const searchInput = useTemplateRef<HTMLElement>("searchInput");
useFocus(searchInput, { initialValue: true });

const { searchAnime, clearResults } = useSearchStore();

const debounceSearch = useDebounceFn(searchAnime, 500);

function handleDirectSearch() {
  searchAnime(searchTerm.value);
}

function clearSearch() {
  searchTerm.value = "";
  clearResults();
}

watch(searchTerm, (newSearchTerm) => {
  if (newSearchTerm.trim() === "") {
    clearResults();
    return;
  }
  debounceSearch(newSearchTerm);
});
</script>
