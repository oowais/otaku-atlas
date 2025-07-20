<template>
  <div class="flex justify-center items-center min-h-screen text-foreground">
    <div class="text-center p-8">
      <h1 class="text-8xl font-bold m-0 opacity-80">404</h1>
      <h2 class="text-2xl my-4 font-light">Page Not Found</h2>
      <p class="text-lg my-8 opacity-90">
        Oops! This page went on an adventure and forgot to come back. Maybe it's
        binge-watching anime somewhere?
      </p>
      <router-link
        to="/"
        class="inline-block px-8 py-3 bg-white/20 text-foreground no-underline rounded-full border-2 border-white/30 transition-all duration-300 ease-in-out font-medium hover:bg-white/30 hover:-translate-y-0.5"
      >
        Go Back Home
      </router-link>
    </div>
  </div>
</template>
