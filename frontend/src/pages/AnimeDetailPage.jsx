import { useParams, Navigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { animeDetailsQueryOptions } from "../api/animeService";
import WatchlistButton from '../components/WatchlistButton';
import LoadingSpinner from '../components/LoadingSpinner';

const AnimeDetailPage = () => {
  const { id, name } = useParams();
  const { data: anime, isLoading, error } = useQuery(animeDetailsQueryOptions(id, name));

  if (isLoading) return <LoadingSpinner />;
  if (error) return <p>Error: Could not fetch anime details.</p>;

  if (anime.slug && name !== anime.slug) {
    return <Navigate to={`/anime/${id}/${anime.slug}/`} replace />;
  }

  return (
    <div className="max-w-[1520px] mx-auto p-4 md:p-[30px]">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-shrink-0 w-full md:w-[300px]">
          <img 
            src={anime.cover_image} 
            alt={anime.title} 
            className="block rounded-lg shadow-lg object-cover h-auto max-w-full mx-auto"
          />
        </div>
        <div className="flex-grow">
          <h1 className="text-4xl font-bold mb-4 text-white">{anime.title}</h1>
          <div className="mb-6">
            <WatchlistButton anime={anime} />
          </div>
          <div className="prose prose-invert max-w-none">
            <h3 className="text-xl font-semibold mb-2 text-gray-200">Description</h3>
            <p className="text-gray-300 leading-relaxed whitespace-pre-line text-lg">
              {anime.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimeDetailPage;