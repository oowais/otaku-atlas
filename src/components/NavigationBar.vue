<template>
  <div class="relative border-blue-2">
    <nav class="flex flex-row xs:flex-col">
      <NavigationMenu>
        <NavigationMenuList class="flex flex-row max-[300px]:flex-col">
          <NavigationMenuItem>
            <NavigationMenuLink
              href="/"
              :class="[
                navigationMenuTriggerStyle(),
                route.path === '/' ? 'border-2' : '',
              ]"
            >
              Search
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              href="/watchlist"
              :class="[
                navigationMenuTriggerStyle(),
                route.path === '/watchlist' ? 'border-2' : '',
              ]"
            >
              Watchlist
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </nav>
    <div class="absolute bottom-2 right-0">
      <ThemeSwitcher />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";

import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";

const route = useRoute();
</script>
