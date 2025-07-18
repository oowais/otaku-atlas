<script setup lang="ts">
import { RouterView } from "vue-router";

import { searchAnime } from "@/graphql/queries";
</script>

<template>
  <header>
    <h1>Otaku Atlas</h1>
    {{ searchAnime("Gintama") }}
  </header>
  <main>
    <RouterView />
  </main>
</template>
