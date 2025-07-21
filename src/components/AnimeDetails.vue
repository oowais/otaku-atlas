<template>
  <Drawer v-model:open="drawerState">
    <DrawerContent>
      <div class="mx-auto w-full max-w-md">
        <DrawerHeader>
          <template v-if="loading">
            <div class="space-y-2">
              <Skeleton
                class="h-6 w-3/4 animate-pulse"
                style="animation-delay: 0ms"
              />
              <Skeleton
                class="h-4 w-1/2 opacity-70 animate-pulse"
                style="animation-delay: 100ms"
              />
            </div>
          </template>
          <template v-else>
            <DrawerTitle>{{ anime?.title?.romaji }} </DrawerTitle>
            <DrawerTitle class="text-xs text-muted-foreground">
              {{ anime?.title?.english }}
            </DrawerTitle>
          </template>
          <div class="flex gap-2 items-center mb-2">
            <img
              v-if="!loading && anime?.coverImage?.large"
              :src="anime?.coverImage?.large"
              alt="Anime Cover"
              class="w-50 h-50 object-scale-down"
            />
            <template v-else>
              <Skeleton
                class="w-24 h-32 rounded-md flex-shrink-0 animate-pulse"
                style="animation-delay: 200ms"
              />
            </template>
            <div class="flex flex-col">
              <template v-if="anime?.status">
                <Badge :class="getStatusButtonClass(anime?.status)">
                  {{ formatStatus(anime?.status) }}
                </Badge>
              </template>
              <template v-if="anime?.averageScore">
                <Separator class="my-2" />
                Rating
                {{ anime.averageScore / 10 + "/10" }}
              </template>
              <template v-if="anime?.startDate?.year">
                <Separator class="my-2" />
                {{ anime.startDate.year }} -
                {{ anime?.endDate?.year || "now" }}
              </template>
            </div>
          </div>
          <UserStatusSwitcher v-if="props.animeId" :animeId="props.animeId" />
          <DrawerDescription v-if="!loading && anime?.description" class="mt-2">
            Description
            <ScrollArea
              class="max-h-[200px] min-h-0 rounded-md border p-2 overflow-auto"
            >
              <div v-html="anime?.description" />
            </ScrollArea>
          </DrawerDescription>
          <template v-else>
            <div class="mt-4 space-y-2">
              <Skeleton
                class="h-4 w-20 animate-pulse"
                style="animation-delay: 800ms"
              />
              <div class="rounded-md border p-2 space-y-2">
                <Skeleton
                  v-for="(_, index) in 7"
                  :key="index"
                  :class="[
                    'h-3 animate-pulse',
                    index === 2
                      ? 'w-3/4'
                      : index === 4
                        ? 'w-2/3'
                        : index === 6
                          ? 'w-4/5'
                          : 'w-full',
                  ]"
                  :style="{ animationDelay: `${850 + index * 50}ms` }"
                />
              </div>
            </div>
          </template>
        </DrawerHeader>
        <DrawerFooter>
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
import { formatStatus, getStatusButtonClass } from "@/utils/formatters";

const props = withDefaults(
  defineProps<{
    animeId: number | null;
  }>(),
  { animeId: null },
);

const drawerState = ref(false);
const anime = ref<Anime | null>(null);
const loading = ref(false);

onMounted(() => {
  if (props.animeId) {
    drawerState.value = true;
    loadAnimeDetails(props.animeId);
  } else {
    drawerState.value = false;
    anime.value = null;
  }
});

async function loadAnimeDetails(id: number) {
  loading.value = true;
  const result = await getAnimeById(id);

  if (!result.success) {
    toast.error("Failed to load details");
    anime.value = null;
    loading.value = false;
    return;
  }
  anime.value = result.data || null;
  loading.value = false;
}
</script>
