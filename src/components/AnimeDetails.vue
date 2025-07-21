<template>
  <Drawer v-model:open="openDrawer">
    <DrawerContent>
      <div class="mx-auto w-full max-w-md">
        <DrawerHeader>
          <DrawerTitle>{{ anime?.title?.romaji }} </DrawerTitle>
          <DrawerTitle class="text-xs text-muted-foreground">
            {{ anime?.title?.english }}
          </DrawerTitle>
          <div class="flex gap-2 items-center mb-2">
            <img
              v-if="anime?.coverImage?.large"
              :src="anime?.coverImage?.large"
              alt="Anime Cover"
              class="w-50 h-50 object-scale-down"
            />
            <div class="flex flex-col">
              <template v-if="anime?.status">
                <Badge :class="getStatusButtonClass(anime?.status)">
                  {{ formatStatus(anime?.status) }}
                </Badge>
              </template>
              <template v-if="anime?.averageScore">
                <Separator class="my-2" />
                Score:
                {{ anime.averageScore + "%" }}
              </template>
              <template v-if="anime?.startDate?.year">
                <Separator class="my-2" />
                {{ anime.startDate.year }} -
                {{ anime?.endDate?.year || "now" }}
              </template>
            </div>
          </div>
          <UserStatusSwitcher v-if="props.animeId" :animeId="props.animeId" />
          <DrawerDescription v-if="anime?.description" class="mt-2">
            Description
            <ScrollArea
              class="max-h-[200px] min-h-0 rounded-md border p-2 overflow-auto"
            >
              <div v-html="anime?.description" />
            </ScrollArea>
          </DrawerDescription>
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

const openDrawer = ref(false);
const anime = ref<Anime | null>(null);

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

  openDrawer.value = true;
}
</script>
