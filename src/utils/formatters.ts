import type { Anime } from "@/graphql/types";

function formatStatus(status: Anime["status"] | null): string {
  if (!status) return "";

  const statusMap: Record<NonNullable<Anime["status"]>, string> = {
    FINISHED: "Finished",
    RELEASING: "Airing",
    NOT_YET_RELEASED: "Upcoming",
    CANCELLED: "Cancelled",
    HIATUS: "Hiatus",
  };

  return statusMap[status];
}

export { formatStatus };
