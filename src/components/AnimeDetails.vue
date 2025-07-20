<template>
  <Drawer v-model:open="openDrawer">
    <DrawerContent>
      <DrawerHeader>
        <DrawerTitle>Anime Details</DrawerTitle>
        <DrawerDescription>Desc.</DrawerDescription>
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
import { ref, watch } from "vue";

const props = withDefaults(
  defineProps<{
    open: number | null;
  }>(),
  {
    open: null,
  },
);

const openDrawer = ref(!!props.open);
watch(
  () => props.open,
  async (newValue) => {
    if (newValue === null) {
      openDrawer.value = false;
      return;
    }
    await loadAnimeDetails(newValue);
    openDrawer.value = !!newValue;
  },
);

// TODO: combine getAnimeById and with useWatchlist
function loadAnimeDetails(id: number) {}
</script>
