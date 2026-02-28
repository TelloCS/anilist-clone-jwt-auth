import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import { watchlistQueryOptions } from "../api/animeService";
import LoadingSpinner from "../components/LoadingSpinner";

export default function Profile() {
  const { username, email } = useAuth();
  const { data: watchlist, isLoading } = useQuery(watchlistQueryOptions);

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <h2>Username: {username}</h2>
      <h2>Email: {email}</h2>
      <h3>My Watchlist</h3>
      {watchlist && watchlist.length > 0 ? (
        <ul>
          {watchlist.map(animeId => (
            <li key={animeId}>Anime ID: {animeId}</li>
          ))}
        </ul>
      ) : (
        <p>Your watchlist is empty.</p>
      )}
    </div>
  )
}