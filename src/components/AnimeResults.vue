<template>
  <div class="flex-1 min-h-[500px] overflow-y-auto">
    <template v-if="loading">
      <div class="flex flex-col space-y-4">
        <!-- Header -->
        <div class="flex space-x-4 pb-2 border-b border-border">
          <Skeleton class="h-5 w-[100px]" />
          <Skeleton class="h-5 w-12" />
          <Skeleton class="h-5 w-32" />
          <Skeleton class="h-5 w-20 hidden md:block" />
        </div>

        <!-- Rows -->
        <div v-for="i in 5" :key="i" class="flex space-x-4 items-center">
          <Skeleton class="h-4 w-[100px]" />
          <Skeleton class="h-10 w-10 rounded" />
          <Skeleton class="h-4 flex-1 max-w-xs" />
          <Skeleton class="h-4 w-20 hidden md:block" />
        </div>
      </div>
    </template>
    <template v-if="error">
      <Alert variant="destructive">
        <AlertCircle class="w-4 h-4" />
        <AlertTitle>Error :( </AlertTitle>
        <AlertDescription>
          Unable to fetch search results. Please try again later.
        </AlertDescription>
      </Alert>
    </template>
    <template
      v-if="
        searchResults.length === 0 &&
        currentSearchTerm !== '' &&
        !loading &&
        !error
      "
    >
      <Alert>
        <TriangleAlert class="w-4 h-4" />
        <AlertTitle> Zilch! </AlertTitle>
        <AlertDescription>
          No results found for "{{ currentSearchTerm }}" :(.
        </AlertDescription>
      </Alert>
    </template>
    <Table v-else-if="searchResults.length > 0" class="w-full table-fixed">
      <TableCaption>Search results</TableCaption>
      <colgroup>
        <col class="w-16 sm:w-20" />
        <col class="w-12 sm:w-22" />
        <col class="w-auto" />
        <col class="w-20 hidden md:table-cell" />
      </colgroup>
      <TableHeader>
        <TableRow>
          <TableHead> Year </TableHead>
          <TableHead><Image /></TableHead>
          <TableHead>Name</TableHead>
          <TableHead class="text-right hidden md:table-cell">Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="entry in searchResults" :key="entry.id">
          <TableCell class="font-medium px-2">
            {{ entry.startDate?.year || "" }}
          </TableCell>
          <TableCell>
            <img
              v-if="entry.coverImage?.medium"
              :src="entry.coverImage?.medium"
              alt="Anime Cover"
              class="w-10 h-10 sm:w-20 sm:h-20 rounded object-scale-down"
            />
          </TableCell>
          <TableCell>
            <p class="truncate">
              {{ entry.title?.romaji || "--" }}
            </p>
            <p class="truncate text-sm text-muted-foreground">
              {{ entry.title?.english || "" }}
            </p>
          </TableCell>
          <TableCell class="text-right hidden md:block">
            {{ formatStatus(entry.status) }}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
    <div
      ref="container"
      v-if="hasNextPage && searchResults.length > 0"
      class="h-20 flex items-center justify-center"
    >
      <p class="text-muted-foreground text-sm">
        Scroll down for more results...
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useInfiniteScroll } from "@vueuse/core";
import { AlertCircle, Image, TriangleAlert } from "lucide-vue-next";
import { storeToRefs } from "pinia";
import { useTemplateRef } from "vue";

import { useSearchStore } from "@/stores/search";
import { formatStatus } from "@/utils/formatters";

const containerRef = useTemplateRef<HTMLElement>("container");

const { searchResults, currentSearchTerm, loading, error, hasNextPage } =
  storeToRefs(useSearchStore());
const { loadMore } = useSearchStore();

useInfiniteScroll(containerRef, loadMore, {
  distance: 10,
  canLoadMore: () => {
    return hasNextPage.value && !loading.value;
  },
});
</script>
