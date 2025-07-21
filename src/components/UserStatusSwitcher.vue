<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button
        :class="getStatusButtonClass(currentStatus)"
        @click.stop
        class="text-xs"
      >
        {{ formatUserStatus(currentStatus) }}
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent class="w-56">
      <DropdownMenuRadioGroup v-model="watchlist[props.animeId]">
        <DropdownMenuRadioItem value="watching">
          Watching
        </DropdownMenuRadioItem>
        <DropdownMenuRadioItem value="planToWatch">
          Plan To Watch
        </DropdownMenuRadioItem>
        <DropdownMenuRadioItem value="completed">
          Completed
        </DropdownMenuRadioItem>
        <DropdownMenuRadioItem value="onHold"> On Hold </DropdownMenuRadioItem>
        <DropdownMenuRadioItem value="dropped"> Dropped </DropdownMenuRadioItem>
        <DropdownMenuItem
          @click="removeFromWatchlist({ animeId: props.animeId })"
        >
          <X />
          Remove from Watchlist
        </DropdownMenuItem>
      </DropdownMenuRadioGroup>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
<script setup lang="ts">
import { X } from "lucide-vue-next";
import { storeToRefs } from "pinia";
import { computed } from "vue";

import type { UserStatus } from "@/stores/types";
import { useWatchlistStore } from "@/stores/watchlist";
import { formatUserStatus } from "@/utils/formatters";

const props = defineProps<{ animeId: number }>();

const { removeFromWatchlist } = useWatchlistStore();
const { watchlist } = storeToRefs(useWatchlistStore());

const currentStatus = computed(() => watchlist.value[props.animeId]);

function getStatusButtonClass(status: UserStatus) {
  switch (status) {
    case "watching":
      return "bg-blue-800 text-white";
    case "completed":
      return "bg-green-800 text-white";
    case "planToWatch":
      return "bg-yellow-800 text-white";
    case "onHold":
      return "bg-orange-800 text-white";
    case "dropped":
      return "bg-red-800 text-white";
    default:
      return "bg-gray-200 text-gray-800";
  }
}
</script>
