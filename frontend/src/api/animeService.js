import { queryOptions } from "@tanstack/react-query";
import api from "./api";

const animeService = {
  getWatchlist: async () => {
    const response = await api.get("/watchlist/");
    return response.data;
  },
  addToWatchlist: async (animeId) => {
    const response = await api.post("/watchlist/", { anime_id: animeId });
    return response.data;
  },
  removeFromWatchlist: async (animeId) => {
    const response = await api.delete("/watchlist/", { data: { anime_id: animeId } });
    return response.data;
  },
  getAnimeDetails: async (id, name) => {
    const response = await api.get(`/v1/anime/${id}/${name}/`);
    return response.data;
  },
  getTrendingAnime: async () => {
    const response = await api.get("/v1/trending");
    return response.data;
  },
};

export const trendingAnimeQueryOptions = queryOptions({
  queryKey: ["trendingAnime"],
  queryFn: animeService.getTrendingAnime,
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