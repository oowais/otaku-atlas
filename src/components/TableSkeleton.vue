<template>
  <div class="flex flex-col space-y-4">
    <div class="flex space-x-4 pb-2 border-b border-border">
      <Skeleton class="h-5 w-[100px]" />
      <Skeleton class="h-5 w-12" />
      <Skeleton class="h-5 w-32" />
      <Skeleton class="h-5 w-20 hidden md:block" />
    </div>

    <div v-for="i in 5" :key="i" class="flex space-x-4 items-center">
      <Skeleton class="h-4 w-[100px]" />
      <Skeleton class="h-10 w-10 rounded" />
      <Skeleton class="h-4 flex-1 max-w-xs" />
      <Skeleton class="h-4 w-20 hidden md:block" />
    </div>
  </div>
</template>
