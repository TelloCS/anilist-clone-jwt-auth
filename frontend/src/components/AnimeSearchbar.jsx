import { useState, useRef, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import animeService from '../api/animeService';
import { useDebounce } from '../hooks/useDebounce';
import { useOnClickOutside } from '../hooks/useOnClickOutside';
import SearchInput from './SearchInput';
import SearchDropdown from './SearchDropdown';

export default function AnimeSearchbar() {
  const [inputValue, setInputValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const debouncedSearch = useDebounce(inputValue, 400);

  const { data: searchResults, isFetching } = useQuery({
    queryKey: ['animeSearch', debouncedSearch],
    queryFn: () => animeService.searchAnime(debouncedSearch),
    enabled: debouncedSearch.length >= 3,
    staleTime: 1000 * 60 * 5,
  });

  useOnClickOutside(containerRef, () => setIsOpen(false));

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    setSelectedIndex(-1);
    setIsOpen(value.length >= 3);
  };

  const handleClear = useCallback(() => {
    setInputValue('');
    setIsOpen(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  }, []);

  const handleSelect = useCallback(() => {
    setInputValue('');
    setIsOpen(false);
    setSelectedIndex(-1);
  }, []);

  const handleKeyDown = (e) => {
    if (!isOpen || !searchResults?.length) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < searchResults.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const targetItem = selectedIndex >= 0 ? searchResults[selectedIndex] : searchResults[0];
      
      if (targetItem) {
        handleSelect();
        navigate(`/anime/${targetItem.id}/${targetItem.slug}/`);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div className="relative w-[285px] max-w-md mx-auto z-50" ref={containerRef}>
      <SearchInput 
        ref={inputRef}
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={() => { if (inputValue.length >= 3) setIsOpen(true); }}
        onClear={handleClear}
        isOpen={isOpen}
      />
      <SearchDropdown 
        isOpen={isOpen}
        isFetching={isFetching}
        results={searchResults}
        selectedIndex={selectedIndex}
        onSelect={handleSelect}
      />
    </div>
  );
}