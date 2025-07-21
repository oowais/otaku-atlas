import type { Anime } from "@/graphql/types";

type UserStatus =
  | "watching"
  | "planToWatch"
  | "completed"
  | "onHold"
  | "dropped";

type AnimeWatchlist = {
  anime: Anime;
  status: UserStatus;
};

export type { AnimeWatchlist, UserStatus };
