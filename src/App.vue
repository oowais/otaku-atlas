<template>
  <div class="min-h-screen bg-background text-foreground flex overflow-hidden">
    <div class="mx-auto max-w-[1100px] px-4 sm:px-6 lg:px-8 w-full">
      <header class="py-6 sm:py-8">
        <h1
          class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl"
        >
          Otaku Atlas
        </h1>
        <p class="text-sm text-muted-foreground mb-2">
          Search and track your favorite anime!
        </p>
        <Separator />
      </header>

      <nav class="mb-6 sm:mb-8">
        <NavigationBar />
      </nav>

      <button :class="scrollToTopButtonClass" @click="scrollToTop">
        <ArrowUp class="w-8 h-8" />
      </button>

      <main class="pb-8">
        <RouterView />
      </main>
      <Toaster />
    </div>
  </div>
</template>

<script setup lang="ts">
import "vue-sonner/style.css";

import { useWindowScroll } from "@vueuse/core";
import { ArrowUp } from "lucide-vue-next";
import { computed } from "vue";
import { RouterView } from "vue-router";

import { Toaster } from "@/components/ui/sonner";

const { y } = useWindowScroll();
const MAX_SCROLL = 300;

const scrollToTopButtonClass = computed(() => {
  return y.value < MAX_SCROLL
    ? "hidden"
    : "fixed bottom-5 right-5 block rounded-md border border-secondary-900 z-50";
});

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};
</script>
