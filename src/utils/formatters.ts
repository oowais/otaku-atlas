import type { Anime } from "@/graphql/types";
import type { UserStatus } from "@/stores/types";

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

function getStatusButtonClass(status: Anime["status"]) {
  switch (status) {
    case "FINISHED":
      return "bg-green-600 text-white";
    case "RELEASING":
      return "bg-blue-600  text-white";
    case "NOT_YET_RELEASED":
      return "bg-yellow-600 hover:bg-yellow-700 text-white";
    case "CANCELLED":
      return "bg-red-600 hover:bg-orange-700 text-white";
    case "HIATUS":
      return "bg-orange-600 hover:bg-red-700 text-white";
    default:
      return "";
  }
}

function formatUserStatus(status: UserStatus | null): string {
  if (!status) return "Add To Watchlist";

  const statusMap: Record<UserStatus, string> = {
    watching: "Watching",
    planToWatch: "Plan to Watch",
    completed: "Completed",
    onHold: "On Hold",
    dropped: "Dropped",
  };

  return statusMap[status];
}

export { formatStatus, formatUserStatus, getStatusButtonClass };
