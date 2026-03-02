import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

export default function SearchDropdown({
  isOpen,
  isFetching,
  results,
  selectedIndex,
  onSelect
}) {
  const listRef = useRef(null);

  useEffect(() => {
    if (selectedIndex >= 0 && listRef.current) {
      const activeElement = listRef.current.children[selectedIndex];
      if (activeElement) activeElement.scrollIntoView({ block: 'nearest' });
    }
  }, [selectedIndex]);

  if (!isOpen) return null;

  return (
    <div className="absolute top-full left-0 w-full mt-2 overflow-hidden rounded bg-[#222124]">
      {isFetching ? (
        <div className="p-4 text-center text-gray-400 text-sm">Searching...</div>
      ) : results?.length === 0 ? (
        <div className="p-4 text-center text-gray-400 text-sm">No shows found.</div>
      ) : (
        <ul
          ref={listRef}
          className="max-h-80 overflow-y-auto text-white"
          id="search-dropdown-list"
          role="listbox"
        >
          {results?.map((anime, index) => {
            const isActive = index === selectedIndex;

            return (
              <li
                key={anime.id}
                role="option"
                aria-selected={isActive}
              >
                <Link
                  to={`/anime/${anime.id}/${anime.slug}/`}
                  onClick={onSelect}
                  className={`flex items-center gap-4 p-3 transition-colors border-b border-[#383838] last:border-0 cursor-pointer
                    ${isActive ? 'bg-[#383838]' : 'hover:bg-[#383838]'}
                  `}
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">{anime.title}</p>
                    <p className="text-xs text-gray-400 mt-1">{anime.releaseDate}</p>
                  </div>
                  <img
                    className="w-12 h-16 object-cover rounded"
                    src={anime.coverImage}
                    alt={anime.title}
                    loading="lazy"
                  />
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}