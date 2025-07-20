<template>
  <div class="min-h-screen bg-background text-foreground">
    <div class="mx-auto max-w-[1100px] px-4 sm:px-6 lg:px-8">
      <header class="py-6 sm:py-8">
        <h1
          class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl"
        >
          Otaku Atlas
        </h1>
        <p class="text-sm text-muted-foreground">
          Search and track your favorite anime!
        </p>
      </header>

      <nav class="mb-6 sm:mb-8">
        <NavigationBar />
      </nav>

      <main class="pb-8">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterView } from "vue-router";
</script>
