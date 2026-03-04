import { useParams, Navigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { animeDetailsQueryOptions } from "../api/animeService";
import WatchlistButton from '../components/WatchlistButton';
import LoadingSpinner from '../components/LoadingSpinner';
import { Star, PlayCircle, Calendar, Info } from 'lucide-react'

const AnimeDetailPage = () => {
  const { id, name } = useParams();
  const { data: anime, isLoading, error } = useQuery(animeDetailsQueryOptions(id, name));

  if (isLoading) return <LoadingSpinner />;
  if (error) return <p>Error: Could not fetch anime details.</p>;

  if (anime.slug && name !== anime.slug) {
    return <Navigate to={`/anime/${id}/${anime.slug}/`} replace />;
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#171717] text-white">
      <div className="max-w-[1520px] mx-auto px-4 py-8 md:py-12 md:px-[30px]">
        <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
          <div className="w-full md:w-[260px] flex-shrink-0 flex flex-col items-center md:items-start gap-6">

            <div className="relative w-[220px] md:w-full aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl border border-[#292929] bg-[#222124]">
              <img
                src={anime.coverImage}
                alt={anime.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 right-3 z-10">
                <WatchlistButton anime={anime} />
              </div>
            </div>

            <div className="w-[220px] md:w-full bg-[#222124] border border-[#292929] rounded-xl p-5 space-y-4 shadow-lg">
              {anime.meanScore && (
                <div className="flex items-center gap-3">
                  <Star size={18} className="text-yellow-500" />
                  <div>
                    <p className="text-xs text-[#858585] uppercase tracking-wider font-semibold">Score</p>
                    <p className="font-medium">{anime.meanScore}%</p>
                  </div>
                </div>
              )}

              {anime.episodes && (
                <div className="flex items-center gap-3">
                  <PlayCircle size={18} className="text-blue-500" />
                  <div>
                    <p className="text-xs text-[#858585] uppercase tracking-wider font-semibold">Episodes</p>
                    <p className="font-medium">{anime.episodes}</p>
                  </div>
                </div>
              )}

              {anime.status && (
                <div className="flex items-center gap-3">
                  <Info size={18} className="text-purple-500" />
                  <div>
                    <p className="text-xs text-[#858585] uppercase tracking-wider font-semibold">Status</p>
                    <p className="font-medium capitalize">{anime?.status.replaceAll("_", " ")}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex-grow">
            <h1 className="text-3xl font-bold mb-2 text-center md:text-left leading-tight">
              {anime.title}
            </h1>

            <div className="bg-[#222124] border border-[#292929] rounded-2xl p-6 md:p-8 shadow-lg">
              <h3 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
                Description
              </h3>

              <div className="text-gray-300 text-base md:text-md leading-relaxed space-y-4">
                {anime.description || "No description available for this title."}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AnimeDetailPage;