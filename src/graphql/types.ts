import { graphql, type ResultOf } from "gql.tada";

const animeFieldsFragment = graphql(`
  fragment AnimeFields on Media @_unmask {
    id
    title {
      romaji
      english
    }
    description
    status
    startDate {
      year
    }
    endDate {
      year
    }
    averageScore
    coverImage {
      large
      medium
      color
    }
  }
`);

type Anime = NonNullable<ResultOf<typeof animeFieldsFragment>>;

type SearchResult<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };

export type { Anime, SearchResult };
export { animeFieldsFragment };
