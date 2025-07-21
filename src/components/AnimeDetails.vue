<template>
  <Drawer v-model:open="openDrawer">
    <DrawerContent>
      <DrawerHeader>
        <img
          v-if="anime?.coverImage?.large"
          :src="anime?.coverImage?.large"
          alt="Anime Cover"
          class="w-40 h-40 sm:w-30 sm:h-30 rounded object-scale-down"
        />
        <DrawerTitle>{{ anime?.title?.romaji }}</DrawerTitle>
        <DrawerDescription> {{ anime?.description }}</DrawerDescription>
        <!-- more details, user status, score -->
      </DrawerHeader>
      <DrawerFooter>
        <Button>Add to Watchlist</Button>
        <DrawerClose>
          <Button variant="outline"> Close </Button>
        </DrawerClose>
      </DrawerFooter>
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
