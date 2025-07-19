import type { Anime } from "@/graphql/types";

type UserStatus =
  | "notAdded"
  | "watching"
  | "planToWatch"
  | "completed"
  | "onHold"
  | "dropped";
type UserScore = 0 | 1 | 2 | 3 | 4 | 5;

type WatchlistEntry = {
  animeId: number;
  status: UserStatus;
  score: UserScore;
};

type AnimeWatchlist = {
  anime: Anime;
  watchlistEntry: Pick<WatchlistEntry, "status" | "score">;
};

export type { AnimeWatchlist, UserScore, UserStatus, WatchlistEntry };
