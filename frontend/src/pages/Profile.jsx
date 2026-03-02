import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import { watchlistQueryOptions } from "../api/animeService";
import LoadingSpinner from "../components/LoadingSpinner";
import AnimeCard from "../components/AnimeCard";
import WatchlistButton from "../components/WatchlistButton";

export default function Profile() {
  const { username, email } = useAuth();
  const { data: watchlist, isLoading } = useQuery(watchlistQueryOptions);

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="max-w-[1520px] mx-auto p-4 md:p-[30px]">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-[280px] flex-shrink-0 md:sticky md:top-24 md:self-start">
          <h2 className="text-2xl font-bold mb-6">Profile</h2>
          <div className="bg-[#232323] p-6 rounded-lg">
            <div className="mb-6">
              <p className="text-sm text-[#858585] mb-1">Username</p>
              <p className="">{username}</p>
            </div>
            <div>
              <p className="text-sm text-[#858585] mb-1">Email</p>
              <p className="">{email}</p>
            </div>
          </div>
        </div>

        <div className="flex-grow">
          <h3 className="text-2xl font-bold mb-6">Watchlist</h3>
          {watchlist && watchlist.length > 0 ? (
            <div className='grid gap-8 grid-cols-[repeat(auto-fill,minmax(185px,1fr))] justify-items-center justify-center'>
              {watchlist.map(item => {
                const animeData = {
                    id: item.anime_id,
                    title: item.title,
                    cover_image: item.image_url,
                    slug: item.slug
                };
                return (
                  <AnimeCard key={item.anime_id} anime={animeData}>
                    <WatchlistButton anime={animeData} />
                  </AnimeCard>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-400">Your watchlist is empty.</p>
          )}
        </div>
      </div>
    </div>
  )
}