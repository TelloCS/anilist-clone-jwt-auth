import { useQuery } from '@tanstack/react-query';
import { trendingAnimeQueryOptions } from '../api/animeService';
import AnimeCard from './AnimeCard';
import LoadingSpinner from './LoadingSpinner';
import WatchlistButton from './WatchlistButton';

export default function TrendingNow() {
  const { data: animeData, isLoading, error } = useQuery(trendingAnimeQueryOptions);

  if (isLoading)
    return <LoadingSpinner />;
  if (error)
    return <p>Error: Could not fetch data.</p>;

  return (
    <div className="max-w-[1520px] mx-auto p-4 md:p-[30px]">
      <h3 className="text-2xl font-bold mb-6">Trending Anime</h3>
      <div className="grid gap-8 grid-cols-[repeat(auto-fill,minmax(185px,1fr))] justify-items-center justify-center">
        {animeData.map(anime => (
          <AnimeCard key={anime.id} anime={anime}>
            <WatchlistButton anime={anime} />
          </AnimeCard>
        ))}
      </div>
    </div>
  );
}