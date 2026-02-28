import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { animeDetailsQueryOptions } from "../api/animeService";
import WatchlistButton from '../components/WatchlistButton';
import LoadingSpinner from '../components/LoadingSpinner';

const AnimeDetailPage = () => {
  const { id, name } = useParams();
  const { data: anime, isLoading, error } = useQuery(animeDetailsQueryOptions(id, name));

  if (isLoading) return <LoadingSpinner />;
  if (error) return <p>Error: Could not fetch anime details.</p>;

  return (
    <div>
      <h1>{anime.title}</h1>
      <img src={anime.cover_image} alt={anime.title} />
      <p>{anime.description}</p>
      <WatchlistButton animeId={parseInt(id)} />
    </div>
    
  );
};

export default AnimeDetailPage;