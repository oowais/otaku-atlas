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
      month
      day
    }
    endDate {
      year
      month
      day
    }
    averageScore
    popularity
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
