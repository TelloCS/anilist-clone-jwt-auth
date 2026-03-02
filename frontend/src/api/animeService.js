import { queryOptions, infiniteQueryOptions } from "@tanstack/react-query";
import api from "./api";

const animeService = {
  getWatchlist: async () => {
    const response = await api.get("/watchlist/");
    return response.data;
  },
  addToWatchlist: async (animeId) => {
    const response = await api.post("/watchlist/", { id: animeId });
    return response.data;
  },
  removeFromWatchlist: async (animeId) => {
    const response = await api.delete("/watchlist/", { data: { id: animeId } });
    return response.data;
  },
  getAnimeDetails: async (id, name) => {
    const response = await api.get(`/v1/anime/${id}/${name}/`);
    return response.data;
  },
  getTrendingAnime: async (page) => {
    const response = await api.get(`/v1/trending?page=${page}`);
    return response.data;
  },
  searchAnime: async (searchTerm) => {
    const response = await api.get(`/v1/search?q=${searchTerm}`);
    return response.data.results;
  },
};

export const trendingAnimeQueryOptions = infiniteQueryOptions({
  queryKey: ["trendingAnime"],
  initialPageParam: 1,
  queryFn: ({ pageParam }) => animeService.getTrendingAnime(pageParam),
  getNextPageParam: (lastPage) => {
    if (lastPage.pageInfo.hasNextPage) {
      return lastPage.pageInfo.currentPage + 1;
    }
    return undefined;
  },
  retry: false
});

export const animeDetailsQueryOptions = (id, name) => queryOptions({
  queryKey: ["anime", id],
  queryFn: () => animeService.getAnimeDetails(id, name),
});

export const watchlistQueryOptions = queryOptions({
  queryKey: ["watchlist"],
  queryFn: animeService.getWatchlist,
});

export default animeService;