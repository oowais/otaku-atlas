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

      <button
        ref="backToTopButton"
        class="fixed bottom-5 right-5 hidden rounded-md border border-secondary-900"
        @click="backToTop"
      >
        <ArrowUp class="w-8 h-8" />
      </button>

      <main class="pb-8">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ArrowUp } from "lucide-vue-next";
import { useTemplateRef } from "vue";
import { RouterView } from "vue-router";

const backToTopButtonRef = useTemplateRef<HTMLButtonElement>("backToTopButton");

const scrollFunction = () => {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20)
    backToTopButtonRef.value?.classList.remove("hidden");
  else backToTopButtonRef.value?.classList.add("hidden");
};

const backToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};

window.addEventListener("scroll", scrollFunction);
</script>
