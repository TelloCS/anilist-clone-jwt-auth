import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import animeService, { watchlistQueryOptions } from "../api/animeService";
import { useAuth } from '../context/AuthContext';
import api from '../api/api';
import { Plus, Check, X } from 'lucide-react';

const WatchlistButton = ({ anime }) => {
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

  return (
    <button 
      onClick={(e) => {
        e.preventDefault();
        mutation.mutate();
      }}
      disabled={mutation.isPending}
      className={`
        group w-10 h-10 flex items-center justify-center rounded-full backdrop-blur-md shadow-lg transition-all duration-300
        ${isWatchlisted 
          ? 'bg-[#73E2A7] text-[#0D1821] hover:bg-red-500 hover:text-white hover:scale-110' 
          : 'bg-black/60 text-white hover:bg-[#73E2A7] hover:text-[#0D1821] hover:scale-110'
        }
        ${mutation.isPending ? 'opacity-50 cursor-not-allowed' : ''}
      `}
      title={isWatchlisted ? 'Remove from Watchlist' : 'Add to Watchlist'}
    >
      {mutation.isPending ? (
         <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : isWatchlisted ? (
        <>
          <Check size={20} className="block group-hover:hidden" />
          <X size={20} className="hidden group-hover:block" />
        </>
      ) : (
         <Plus size={20} />
      )}
    </button>
  );
};

export default WatchlistButton;