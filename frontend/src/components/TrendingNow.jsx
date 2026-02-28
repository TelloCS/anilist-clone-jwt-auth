import { useQuery } from '@tanstack/react-query';
import { trendingAnimeQueryOptions } from '../api/animeService';
import AnimeCard from './AnimeCard';
import LoadingSpinner from './LoadingSpinner';

const TrendingNow = () => {
  const { data: animeData, isLoading, error } = useQuery(trendingAnimeQueryOptions);

  if (isLoading)
    return <LoadingSpinner />;
  if (error)
    return <p>Error: Could not fetch data.</p>;

  return (
    <div className='max-w-[1520px] mx-auto p-[30px]'>
      <h2>Trending Anime</h2>
      <div className='grid gap-[28px] grid-cols-[repeat(auto-fill,185px)] justify-between'>
        {animeData.map(anime => (
          <AnimeCard key={anime.id} anime={anime} />
        ))}
      </div>
    </div>
  );
};

export default TrendingNow;