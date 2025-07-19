import type { ResultOf } from "gql.tada";

import { searchAnimeQuery } from "@/graphql/queries";

type SearchAnimeQuery = ResultOf<typeof searchAnimeQuery>;
type Anime = NonNullable<NonNullable<SearchAnimeQuery["Page"]>["media"]>[number];

type SearchResult<T, E = Error> = { success: true; data: T } | { success: false; error: E };

export type { Anime, SearchResult };
