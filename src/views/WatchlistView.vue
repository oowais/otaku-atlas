<template>
  <div class="flex-1 min-h-[400px] overflow-y-auto">
    <template v-if="loading && results.length === 0">
      <TableSkeleton />
    </template>
    <template v-if="error">
      <Alert variant="destructive">
        <AlertCircle class="w-4 h-4" />
        <AlertTitle>Error :( </AlertTitle>
        <AlertDescription>
          Unable to load watchlist. Please try again later.
        </AlertDescription>
      </Alert>
    </template>
    <template v-if="results.length === 0 && !loading && !error">
      <Alert>
        <TriangleAlert class="w-4 h-4" />
        <AlertTitle> Zilch! </AlertTitle>
        <AlertDescription>
          You haven't added any anime to your watchlist yet.
        </AlertDescription>
      </Alert>
    </template>
    <Table v-else-if="results.length > 0" class="w-full table-fixed">
      <TableCaption>Your watchlist</TableCaption>
      <colgroup>
        <col class="w-35 sm:w-40" />
        <col class="w-auto" />
      </colgroup>
      <TableHeader>
        <TableRow>
          <TableHead>Status</TableHead>
          <TableHead>Name</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow
          v-for="entry in results"
          :key="entry.id"
          @click="
            () => {
              selectedAnimeId = entry.id;
              drawerKey++;
            }
          "
          class="cursor-pointer"
        >
          <TableCell>
            <UserStatusSwitcher :anime-id="entry.id" class="text-sm" />
          </TableCell>
          <TableCell>
            <p class="truncate">
              {{ entry.title?.romaji || "--" }}
            </p>
            <p class="truncate text-sm text-muted-foreground">
              {{ entry.title?.english || "" }}
            </p>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
    <div
      ref="container"
      v-if="hasNextPage && results.length > 0"
      class="h-20 flex items-center justify-center"
    >
      <p class="text-muted-foreground text-sm">
        Scroll down for more results...
      </p>
    </div>
  </div>
  <AnimeDetails :anime-id="selectedAnimeId" :key="drawerKey" />
</template>

<script setup lang="ts">
import { useInfiniteScroll } from "@vueuse/core";
import { AlertCircle, TriangleAlert } from "lucide-vue-next";
import { storeToRefs } from "pinia";
import { onMounted, ref, useTemplateRef } from "vue";

import { useWatchlistStore } from "@/stores/watchlist";

const drawerKey = ref(0);
const selectedAnimeId = ref<number | null>(null);
const containerRef = useTemplateRef<HTMLElement>("container");

const { loadAnime, loadMore } = useWatchlistStore();
const { error, loading, results, hasNextPage } =
  storeToRefs(useWatchlistStore());

onMounted(loadAnime);

useInfiniteScroll(containerRef, loadMore, {
  distance: 10,
  canLoadMore: () => {
    return hasNextPage.value && !loading.value;
  },
});
</script>
