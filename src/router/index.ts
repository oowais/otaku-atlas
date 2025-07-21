import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "Search",
      component: () => import("@/views/SearchView.vue"),
    },
    {
      path: "/watchlist",
      name: "Watchlist",
      component: () => import("@/views/WatchlistView.vue"),
    },
    {
      path: "/:pathMatch(.*)*",
      name: "NotFound",
      component: () => import("@/views/404View.vue"),
    },
  ],
});

export default router;
