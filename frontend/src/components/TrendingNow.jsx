import React, { useEffect, useRef } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { trendingAnimeQueryOptions } from '../api/animeService';
import AnimeCard from './AnimeCard';
import LoadingSpinner from './LoadingSpinner';
import WatchlistButton from './WatchlistButton';

export default function TrendingNow() {
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteQuery(trendingAnimeQueryOptions);

  const loadMoreRef = useRef(null);

  useEffect(() => {
    const currentNode = loadMoreRef.current;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    if (currentNode) {
      observer.observe(currentNode);
    }

    return () => {
      if (currentNode) {
        observer.unobserve(currentNode);
      }
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <p className="text-red-500 text-center mt-10">Error: Could not fetch data.</p>;

  return (
    <div className="max-w-[1520px] mx-auto p-4 md:p-[30px]">
      <h3 className="text-2xl font-bold mb-6">Trending Anime</h3>

      <div className="grid gap-8 grid-cols-[repeat(auto-fill,minmax(185px,1fr))] justify-items-center justify-center">
        {data.pages.map((page) => (
          page.results.map((anime) => (
            <AnimeCard key={anime.id} anime={anime}>
              <WatchlistButton anime={anime} />
            </AnimeCard>
          ))
        ))}
      </div>

      <div ref={loadMoreRef} className="w-full h-20 mt-8 flex justify-center items-center">
        {isFetchingNextPage && <LoadingSpinner />}
        {!hasNextPage && data?.pages.length > 0 && (
          <p className="text-gray-500 font-medium">You have reached the end of the list.</p>
        )}
      </div>
    </div>
  );
}