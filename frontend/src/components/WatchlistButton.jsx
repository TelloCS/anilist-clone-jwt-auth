import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import animeService, { watchlistQueryOptions } from "../api/animeService";
import { useAuth } from '../context/AuthContext';
import api from '../api/api';
import { Plus, Minus } from 'lucide-react';

const WatchlistButton = ({ anime, minimal = false }) => {
  const { isLoggedIn } = useAuth();
  const queryClient = useQueryClient();

  const { data: watchlist } = useQuery({
    ...watchlistQueryOptions,
    enabled: isLoggedIn,
  });

  const isWatchlisted = watchlist?.some(item => item.anime_id === anime.id);

  const mutation = useMutation({
    mutationFn: async () => {
      if (isWatchlisted) {
        return await animeService.removeFromWatchlist(anime.id);
      } else {
        return await api.post('/watchlist/', {
          anime_id: anime.id,
          title: anime.title,
          image_url: anime.cover_image,
          slug: anime.slug
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["watchlist"] });
    },
    onError: (error) => {
      console.error('Watchlist action failed:', error);
    },
  });

  if (!isLoggedIn) return null;

  if (minimal) {
    return (
      <button 
        onClick={(e) => {
          e.preventDefault();
          mutation.mutate();
        }} 
        disabled={mutation.isPending}
        className={`
          p-2 rounded-full backdrop-blur-sm transition-colors shadow-md
          ${isWatchlisted 
            ? 'bg-red-500/80 hover:bg-red-600 text-white' 
            : 'bg-[#73E2A7] hover:bg-[#5BC88F] text-[#0D1821]'
          }
          ${mutation.isPending ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        title={isWatchlisted ? 'Remove from Watchlist' : 'Add to Watchlist'}
      >
        {isWatchlisted ? <Minus size={16} /> : <Plus size={16} />}
      </button>
    );
  }

  return (
    <button 
      onClick={() => mutation.mutate()} 
      disabled={mutation.isPending}
      className={`
        flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all duration-200
        ${isWatchlisted 
          ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30' 
          : 'bg-[#73E2A7] text-[#0D1821] hover:bg-[#5BC88F] hover:scale-105'
        }
        ${mutation.isPending ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
      {isWatchlisted ? <Minus size={20} /> : <Plus size={20} />}
      {isWatchlisted ? 'Remove from Watchlist' : 'Add to Watchlist'}
    </button>
  );
};

export default WatchlistButton;