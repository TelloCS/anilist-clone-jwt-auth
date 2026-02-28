import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import animeService, { watchlistQueryOptions } from "../api/animeService";
import { useAuth } from '../context/AuthContext';

const WatchlistButton = ({ animeId }) => {
  const { isLoggedIn } = useAuth();
  const queryClient = useQueryClient();

  const { data: watchlist } = useQuery({
    ...watchlistQueryOptions,
    enabled: isLoggedIn,
  });

  const isWatchlisted = watchlist?.includes(animeId);

  const mutation = useMutation({
    mutationFn: async () => {
      if (isWatchlisted) {
        return await animeService.removeFromWatchlist(animeId);
      } else {
        return await animeService.addToWatchlist(animeId);
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
    <button onClick={() => mutation.mutate()} disabled={mutation.isPending}>
      {isWatchlisted ? 'Remove from Watchlist' : 'Add to Watchlist'}
    </button>
  );
};

export default WatchlistButton;