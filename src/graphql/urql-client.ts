import { Client, cacheExchange, fetchExchange } from "@urql/vue";

const ANILIST_API_URL = "https://graphql.anilist.co";

const client = new Client({
  url: ANILIST_API_URL,
  exchanges: [cacheExchange, fetchExchange],
});

export { client };
