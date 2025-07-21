<template>
  <Drawer v-model:open="openDrawer">
    <DrawerContent>
      <div class="mx-auto w-full max-w-md">
        <DrawerHeader>
          <DrawerTitle class="py-2">{{ anime?.title?.romaji }}</DrawerTitle>
          <div class="flex gap-2 text-sm">
            <img
              v-if="anime?.coverImage?.large"
              :src="anime?.coverImage?.large"
              alt="Anime Cover"
              class="w-60 h-60 sm:w-40 sm:h-40 object-scale-down"
            />
            <div class="flex flex-col">
              <DrawerTitle class="text-xs text-muted-foreground">
                {{ anime?.title?.english }}
              </DrawerTitle>
              <template v-if="anime?.averageScore">
                Score:
                {{ anime.averageScore + "%" }}
              </template>
              <Separator class="my-2" />
              <div class="flex justify-between">
                <template v-if="anime?.startDate?.year">
                  {{ anime.startDate.year }} -
                  {{ anime?.endDate?.year || "now" }}
                </template>
                <Badge v-if="anime?.status">
                  {{ formatStatus(anime?.status) }}
                </Badge>
              </div>
            </div>
          </div>

          <DrawerDescription v-if="anime?.description" class="mt-2">
            Description
            <ScrollArea
              class="max-h-[200px] min-h-0 rounded-md border p-2 overflow-auto"
            >
              {{ anime?.description }}
            </ScrollArea>
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          <Button>Add to Watchlist</Button>
          <DrawerClose>
            <Button variant="outline"> Close </Button>
          </DrawerClose>
        </DrawerFooter>
      </div>
    </DrawerContent>
  </Drawer>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { toast } from "vue-sonner";

import { getAnimeById } from "@/graphql/queries";
import type { Anime } from "@/graphql/types";
import type { WatchlistEntry } from "@/stores/types";
import { useWatchlistStore } from "@/stores/watchlist";
import { formatStatus } from "@/utils/formatters";

const props = withDefaults(
  defineProps<{
    animeId: number | null;
  }>(),
  { animeId: null },
);

const openDrawer = ref(false);
const anime = ref<Anime | null>(null);
const watchlistEntry = ref<WatchlistEntry | null>(null);

const { getWatchlistEntry } = useWatchlistStore();

onMounted(() => {
  if (props.animeId) loadAnimeDetails(props.animeId);
});

async function loadAnimeDetails(id: number) {
  const result = await getAnimeById(id);

  if (!result.success) {
    toast.error("Failed to load details");
    return;
  }
  anime.value = result.data || null;
  watchlistEntry.value = getWatchlistEntry(id) || null;

  openDrawer.value = true;
}
</script>
